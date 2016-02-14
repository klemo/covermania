'''
This module hanles extraction of images from PDF documents.
'''

import gevent
from gevent import monkey; monkey.patch_all()
from gevent.subprocess import Popen, PIPE

import argparse
import os
import logging
import shutil
import uuid
import subprocess
import pyPdf
import random
import multiprocessing
import glob
import json
import re
import cPickle

SIZES = {
    's': '50x72',
    'm': '231x360',
    'l': 'x1024',
    'xl': 'x2048'
}

IMG_QUALITY = 100
IMG_DENSITY = 300
IMG_SHARPEN = '0x1.0'

GIF_NUM_PAGES = 5
GIF_DELAY = 100


def extract_images(inpath, out_dir=None, tmp=False, size='s'):
    '''
    Reads inpath[.pdf] and extracts series of images that correspond to
    pages from the given document
    '''
    
    if not os.path.exists(inpath):
        raise IOError('does not exist: {}'.format(inpath))

    if os.path.isdir(inpath):
        raise IOError('not a file: {}'.format(inpath))
        return

    # validate pdf and extract number of pages
    num_pages = 0
    with open(inpath, 'rb') as fin:
        try:
            pdf = pyPdf.PdfFileReader(fin)
            num_pages = pdf.getNumPages()
        except pyPdf.utils.PdfReadError:
            raise ValueError('invalid pdf')

    if not out_dir:
        # create out_dir name
        if tmp:
            # random dir name
            out_dir = str(uuid.uuid4())[:8]
        else:
            # dir name equals input file name
            name, ext = os.path.splitext(inpath)
            out_dir = name
            
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    single_page = ''
    if num_pages == 1:
        single_page = '-0'

    # extract images from pdf
    print('extracting {} [{}] pages to: {}'.format(
        num_pages, size, out_dir))
    subprocess.call(
        ['convert',
         '-background', 'white',
         '-alpha', 'remove',
         '-density', str(IMG_DENSITY),
         '-resize', SIZES[size],
         inpath,
         '-quality', str(IMG_QUALITY),
         '-sharpen', IMG_SHARPEN,
         os.path.join(out_dir, size) + single_page + '.png',
     ])

    return out_dir, num_pages

    
def resize(path, num_images, in_size, out_size):
    '''
    Take all images (total of num_images) in directory path where name matches:

        in_size-i.png (0<=i<num_images)
    
    and generate total of num_images resized images with name:

        out_size-i.gif (0<=i<num_images)
    '''
    for i in range(num_images):
        img_path = os.path.join(path, '{}-{}.png'.format(in_size, i))
        if os.path.isfile(img_path):
            subprocess.call(
                ['convert',
                 '-resize', SIZES[out_size],
                 img_path,
                 os.path.join(path, '{}-{}.gif'.format(out_size, i)),
             ])

            
def create_gif(path_dir, num_pages, size):
    '''
    Generate gif from images in path_dir. Take num_pages images of given size.
    '''
    # take all pages if number of pages is < GIF_NUM_PAGES
    pages_range = None
    # else take GIF_NUM_PAGES random pages
    if num_pages > GIF_NUM_PAGES:
        pages_range = [0] + random.sample(range(1, num_pages),
                                          GIF_NUM_PAGES - 1)
        print('range: {}'.format(sorted(pages_range)))

    images_path = [os.path.join(path_dir, size) + '-*.gif']
    if pages_range:
        images_path = [os.path.join(path_dir, size) + '-{}.gif'.format(i)
                       for i in pages_range]
    # generate gif from extracted pngs
    print('generating gif: {}/0.gif'.format(path_dir))
    subprocess.call(
        ['convert',
         '-delay', str(GIF_DELAY),
         '-loop', '0'] + 
         images_path + 
         [os.path.join(path_dir, '0.gif')]
    )

    
def generate_metadata(path, out='file'):
    '''
    Generate metadata with all pdf files and corresponding num pages
    '''
    files = [f for f in os.listdir(path) if f.endswith('.pdf')]
    data = []
    for f in sorted(files):
        name, ext = os.path.splitext(f)
        with open(os.path.join(path, f), 'rb') as fin:
            pdf = pyPdf.PdfFileReader(fin)
            num_pages = pdf.getNumPages()
            data.append({'name': name, 'pages': num_pages})
    if out == 'file':
        print('writing data.json')
        with open('data.json', 'w') as fw:
            fw.write(json.dumps(data))
    return data


def get_doc_index(document, filepath):
    words = {}
    command = 'tesseract ' + filepath + ' -l hrv stdout'
    #text = subprocess.check_output(command, shell=True)
    sub = Popen([command], stdout=PIPE, shell=True)
    text, err = sub.communicate()
    # extract page num from file path
    match = re.search('.*xl-(\d+).png', filepath)
    if match:
        page = int(match.groups()[0])
    for word in text.strip().split():
        # skip small words
        if len(word) <= 2:
            continue
        if word in words:
            document_dict = words[word]
            if document['name'] in document_dict:
                pages_set = words[word][document['name']]
                pages_set.add(page)
                words[word][document['name']] = pages_set
            else:
                words[word][document['name']] = set([page])
        else:
            # init word
            words[word] = {document['name']: set([page])}
    return words
    
        
def construct_word_lookup(path):
    '''
    1. Extracts text (OCR) from large (xl) images
    '''
    documents = generate_metadata(path, out=None)
    print('found {} documents'.format(len(documents)))
    words = {}
    for document in documents:
         files = [f for f in glob.glob(os.path.join(
             path, document['name'] + '/xl-*.png'))]
         jobs = [gevent.spawn(get_doc_index, document, f) for f in files]
         gevent.joinall(jobs)
         print [job.value for job in jobs]
    return words
    

def process_file(f):
    '''
    Extracts thumbnails, large images and creates gif
    '''
    # extract large images from input pdf
    out_dir, num_pages = extract_images(f, size='xl')
    # make thumbnails
    resize(out_dir, num_pages, 'xl', 's')
    resize(out_dir, num_pages, 'xl', 'l')
    # create gif from small images
    create_gif(out_dir, num_pages, 's',)
    
                
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--i',
                        default=None,
                        type=str,
                        required=False,
                        help='input')
    parser.add_argument('--c',
                        default=None,
                        type=str,
                        required=False,
                        help='input command')
    args = parser.parse_args()
    if args.i and args.c:
        if args.c == 'meta':
            generate_metadata(args.i)
        elif args.c == 'gen':
            process_file(args.i)
        elif args.c == 'lookup':
            words = construct_word_lookup(args.i)
            with open('words.pickle', 'w') as f:
                cPickle.dump(words, f)
        elif args.c == 'all':
            # get all pdf files in current dir and process
            for f in os.listdir(args.i):
                if f.endswith('.pdf'):
                    process_file(os.path.join(args.i, f))
            generate_metadata(args.i)
    else:
        print('missing params')

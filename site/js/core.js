$( document ).ready(function() {

    var TMPL = {
        'cover-grid': _.template($('#cover-grid-tmpl').text().trim()),
        'page-grid': _.template($('#page-grid-tmpl').text().trim()),
        'footer': _.template($('#footer-tmpl').text().trim()),
    };
    
    var DOCUMENTS = [
        {'name': 'arkzin_I_0', 'pages': 16},
        {'name': 'arkzin_I_1', 'pages': 20},
        // {'name': 'arkzin_I_2-3', 'pages': 28},
        // {'name': 'arkzin_I_4', 'pages': 28},
        // {'name': 'arkzin_I_5-6', 'pages': 36},
        
        
        // {'name': 'arkzin_II_1', 'pages': 20},
        // {'name': 'arkzin_II_2', 'pages': 24},
        // {'name': 'arkzin_II_3', 'pages': 28},
        // {'name': 'arkzin_II_5', 'pages': 32},
        // {'name': 'arkzin_II_6', 'pages': 32},
        // {'name': 'arkzin_II_6_hw_bih', 'pages': 8},
        // {'name': 'arkzin_II_7', 'pages': 32},
        // {'name': 'arkzin_II_7_diktature', 'pages': 8},
        // {'name': 'arkzin_II_8', 'pages': 32},
        // {'name': 'arkzin_II_9', 'pages': 32},

        // {'name': 'arkzin_II_04', 'pages': 43},
        // {'name': 'arkzin_II_10', 'pages': 32},
        // {'name': 'arkzin_II_10_novinari', 'pages': 8},
        // {'name': 'arkzin_II_11', 'pages': 32},
        // {'name': 'arkzin_II_12', 'pages': 32},
        // {'name': 'arkzin_II_13', 'pages': 32},
        // {'name': 'arkzin_II_14', 'pages': 32},
        // {'name': 'arkzin_II_14_fractal', 'pages': 8},
        // {'name': 'arkzin_II_15', 'pages': 32},
        // {'name': 'arkzin_II_16', 'pages': 32},
        // {'name': 'arkzin_II_16_ligma', 'pages': 16},
        // {'name': 'arkzin_II_17', 'pages': 32},
        // {'name': 'arkzin_II_18', 'pages': 32},
        // {'name': 'arkzin_II_19-20', 'pages': 40},
        
        // {'name': 'arkzin_II_21', 'pages': 32},
        // {'name': 'arkzin_II_22', 'pages': 32},
        // {'name': 'arkzin_II_23', 'pages': 32},
        // {'name': 'arkzin_II_24', 'pages': 32},
        // {'name': 'arkzin_II_25', 'pages': 32},
        // {'name': 'arkzin_II_26', 'pages': 32},
        // {'name': 'arkzin_II_26_fractal', 'pages': 8},
        // {'name': 'arkzin_II_27', 'pages': 32},
        // {'name': 'arkzin_II_27_speakout_1', 'pages': 16},
        // {'name': 'arkzin_II_28', 'pages': 32},
        // {'name': 'arkzin_II_28_delozacije', 'pages': 8},
        // {'name': 'arkzin_II_29', 'pages': 32},
        // {'name': 'arkzin_II_29_bastard_1', 'pages': 8},
        
        // {'name': 'arkzin_II_30', 'pages': 32},
        // {'name': 'arkzin_II_31', 'pages': 32},
        // {'name': 'arkzin_II_32', 'pages': 32},
        // {'name': 'arkzin_II_33', 'pages': 32},
        // {'name': 'arkzin_II_33_bastard_2', 'pages': 8},
        // {'name': 'arkzin_II_34', 'pages': 32},
        // {'name': 'arkzin_II_35', 'pages': 32},
        // {'name': 'arkzin_II_35_fractal', 'pages': 8},
        // {'name': 'arkzin_II_36', 'pages': 32},
        // {'name': 'arkzin_II_37', 'pages': 32},
        // {'name': 'arkzin_II_38', 'pages': 32},
        // {'name': 'arkzin_II_38_sferakon', 'pages': 8},
        // {'name': 'arkzin_II_39', 'pages': 32},
        
        // {'name': 'arkzin_II_40', 'pages': 32},
        // {'name': 'arkzin_II_41', 'pages': 32},
        // {'name': 'arkzin_II_42', 'pages': 32},
        // {'name': 'arkzin_II_43', 'pages': 32},
        // {'name': 'arkzin_II_43_bastard_3', 'pages': 8},
        // {'name': 'arkzin_II_44-45', 'pages': 40},
        // {'name': 'arkzin_II_44-45_strip', 'pages': 16},
        // {'name': 'arkzin_II_46', 'pages': 40},
        // {'name': 'arkzin_II_47', 'pages': 40},
        // {'name': 'arkzin_II_48', 'pages': 40},
        // {'name': 'arkzin_II_49', 'pages': 40},
        
        // {'name': 'arkzin_II_50', 'pages': 40},
        // {'name': 'arkzin_II_51', 'pages': 40},
        // {'name': 'arkzin_II_51_bastard_4', 'pages': 8},
        // {'name': 'arkzin_II_52', 'pages': 40},
        // {'name': 'arkzin_II_53', 'pages': 40},
        // {'name': 'arkzin_II_54', 'pages': 40},
        // {'name': 'arkzin_II_55', 'pages': 40},
        // {'name': 'arkzin_II_56', 'pages': 32},
        // {'name': 'arkzin_II_56_bastard_5', 'pages': 8},
        // {'name': 'arkzin_II_57', 'pages': 36},
        // {'name': 'arkzin_II_57_next_five_min', 'pages': 4},
        // {'name': 'arkzin_II_58', 'pages': 40},
        // {'name': 'arkzin_II_59', 'pages': 40},
        
        // {'name': 'arkzin_II_60', 'pages': 40},
        // {'name': 'arkzin_II_61', 'pages': 40},
        // {'name': 'arkzin_II_62', 'pages': 40},
        // {'name': 'arkzin_II_63', 'pages': 40},
        // {'name': 'arkzin_II_64', 'pages': 40},
        // {'name': 'arkzin_II_65', 'pages': 40},
        // {'name': 'arkzin_II_66', 'pages': 40},
        // {'name': 'arkzin_II_67', 'pages': 40},
        // {'name': 'arkzin_II_68', 'pages': 40},
        // {'name': 'arkzin_II_69', 'pages': 40},
  
        // {'name': 'arkzin_II_70-71', 'pages': 48},
        // {'name': 'arkzin_II_72', 'pages': 40},
        // {'name': 'arkzin_II_73', 'pages': 40},
        // {'name': 'arkzin_II_74', 'pages': 40},
        // {'name': 'arkzin_II_75', 'pages': 40},
        // {'name': 'arkzin_II_76', 'pages': 40},
        // {'name': 'arkzin_II_77', 'pages': 40},
        // {'name': 'arkzin_II_78', 'pages': 40},
        // {'name': 'arkzin_II_79', 'pages': 40},
        
        // {'name': 'arkzin_II_80-81', 'pages': 48},
        // {'name': 'arkzin_II_82', 'pages': 48},
        // {'name': 'arkzin_II_83', 'pages': 48},
        // {'name': 'arkzin_II_84', 'pages': 48},
        // {'name': 'arkzin_II_85', 'pages': 48},
        // {'name': 'arkzin_II_86', 'pages': 48},
        // {'name': 'arkzin_II_87', 'pages': 48},
        // {'name': 'arkzin_II_88', 'pages': 48},
        // {'name': 'arkzin_II_89', 'pages': 48},
        
        // {'name': 'arkzin_II_90', 'pages': 48},
        // {'name': 'arkzin_II_91', 'pages': 48},
        // {'name': 'arkzin_II_92', 'pages': 48},
        // {'name': 'arkzin_II_93', 'pages': 40},

        // {'name': 'arkzin_III_1', 'pages': 108},
        // {'name': 'arkzin_III_2', 'pages': 108},
        // {'name': 'arkzin_III_3', 'pages': 108},
        // {'name': 'arkzin_III_4', 'pages': 108},
        // {'name': 'arkzin_III_5', 'pages': 84},
        // {'name': 'arkzin_III_6', 'pages': 84},
        // {'name': 'arkzin_III_7', 'pages': 84},
    ];

    var ACTIVE = [];

    var _highlight_document = function(name) {
        $('.cell[rel="' + name + '"] img').addClass('highlight');
    };

    var _unhighlight_document = function(name) {
        $('.cell[rel="' + name + '"] img').removeClass('highlight');
    };

    var _load_popup = function(name, page) {
        var img = '#popup img';
        $(img).attr('src', 'd/' + name + '/l-' + page + '.gif');
        $(img).attr('name', name);
        $(img).attr('page', page);
    };

    var _load_prev_popup = function() {
        var img = '#popup img';
        var name = $(img).attr('name');
        var page = parseInt($(img).attr('page'));
        if (page >= 1) {
            _load_popup(name, page - 1);
        };
    };

    var _load_next_popup = function() {
        var img = '#popup img';
        var name = $(img).attr('name');
        var page = parseInt($(img).attr('page'));
        for(var i=0; i<DOCUMENTS.length; i++) {
            if (DOCUMENTS[i]['name'] == name && page < DOCUMENTS[i]['pages'] - 1) {
                _load_popup(name, page + 1);
                return;
            };
        };
    };

    var _remove_active = function(name) {
        var _ind = _.indexOf(ACTIVE, name);
        if (_ind > -1) {
            ACTIVE.splice(_ind, 1);
            $('.cell[type="page"][rel="' + name + '"]').remove();
        };
    };

    var _footer_links = function() {
        $('#active').empty().append(
            TMPL['footer']({active: ACTIVE}));
        $('#active .active-link').hover(
            function() {
                var sel = $(this).attr('rel');
                _highlight_document(sel);
            }, function() {
                var sel = $(this).attr('rel');
                _unhighlight_document(sel);
            }
        );
        $('#active .active-link').click(
            function() {
                var sel = $(this).attr('rel');
                _remove_active(sel);
                _unhighlight_document(sel);
                _footer_links();
        });
    };

    var _add_hover = function(elem) {
        elem.hover(
            function() {
                var type = $(this).attr('type');
                var name = $(this).attr('rel');
                var htext = name;
                if (type == 'cover') {
                    $(this).find('.cover').hide();
                    $(this).find('.gif').attr('src', 'd/' + name + '/0.gif').show();   
                } else if (type == 'page') {
                    var page = $(this).attr('page');
                    htext = name + '(' + page + ')'
                };
                $('#hovered').append($('<span>').text(htext));
                _highlight_document(name);
            }, function() {
                $('#hovered').empty();
                var type = $(this).attr('type');
                var name = $(this).attr('rel');
                if (type == 'cover') {
                    $(this).find('.cover').show();
                    $(this).find('.gif').hide();
                };
                _unhighlight_document(name);
            }
        );
    };

    var _add_click = function(elem) {
        elem.click(
            function() {
                var type = $(this).attr('type');
                var name = $(this).attr('rel');
                if (type == 'page') {
                    var page = $(this).attr('page');
                    _load_popup(name, page);
                    $('#popup').show();
                    return;
                };
                if (!_.contains(ACTIVE, name)) {
                    ACTIVE.push(name);
                    var pages = parseInt($(this).attr('pages'));
                    var nn = $(this);
                    for(var i=1; i<pages; i++) {
                        var _page = $(TMPL['page-grid']({name: name, page: i}));
                        _page.insertAfter(nn);
                        nn = _page;
                        _add_hover(_page);
                        _add_click(_page);
                    };
                } else {
                    _remove_active(name);
                };
                _footer_links();
            });
    };

    var _init = function() {
        var container = $('#grid');
        $.each(DOCUMENTS, function(i, v) {
            var cover = $(TMPL['cover-grid'](v));
            container.append(cover);
            _add_hover(cover);
            _add_click(cover);
        });

        $('#popup').click(function(){
            $(this).hide();
        });

        $(document).keyup(function(e) {
            // hide popup on escape
            if (e.keyCode == 27) {
                $('#popup').hide();
            // show left page
            } else if (e.keyCode == 37) {
                _load_prev_popup();
            // show right page
            } else if (e.keyCode == 39) {
                _load_next_popup();
            };
        });
    };

    _init();

});

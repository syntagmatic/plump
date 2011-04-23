var plump = (function (Raphael) {
    var plump = {};

    /****************/
    // Helper functions
    Object.size = function (obj) {
        var size = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
    Object.extend = function (obj2, obj) {
        // Keeps obj's values, if they exist
        for (var key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                obj[key] = obj[key] || obj2[key];
            }
        }
        return obj;
    };
    /****************/


    var icon = plump.icon = function(name, attrs) {
        var attrs = attrs || {},
            none = {fill: "#000", opacity: 0},
            x = attrs.x || 0,
            y = attrs.y || 0;
        attrs.stroke = attrs.stroke || 'none';
        attrs.fill = attrs.fill || '#333';

        // Non-standard attributes
        attrs.size = attrs.size || 24;
        attrs.glow = attrs.glow || 'transparent';
        attrs['glow-width'] = attrs['glow-width'] || 2;
        if (attrs.hover) {
            attrs.hover.duration = attrs.hover.duration || 0;
        }

        var r = Raphael(x-2, y-2, attrs.size + 4, attrs.size + 4),
            s = r.path(paths[name]).scale(attrs.size/32, attrs.size/32, 0, 0).translate(2, 2).attr({fill: 'none', stroke: attrs.glow, 'stroke-width': attrs['glow-width']}),
            icon = r.path(paths[name]).scale(attrs.size/32, attrs.size/32, 0, 0).translate(2, 2).attr(attrs),
            target = r.rect(0, 0, 32, 32).attr(none).click(function () {
                icon.attr({fill: "90-#0050af-#002c62"});
            }).hover(function () {
                if (attrs.hover) {
                    icon.animate(attrs.hover, attrs.hover.duration);
                }
                //s.stop().animate({opacity: 1}, 200);
            }, function () {
                icon.stop().attr(attrs);
                //s.stop().attr({opacity: 0});
            });
        return { icon: icon
               , target: target
               , attrs: attrs
               , name: name
               , attr: function(attrs) { icon.attr(attrs); return this; }
               }
    };

    var row = plump.row = function(icons, attrs) {
        for (var name in icons) {
            if (icons.hasOwnProperty(name)) {
                window[name] = icon(name, Object.extend(attrs, icons[name]));
                attrs.x += 37;
            }
        }
    };

    var column = plump.column = function(icons, attrs) {
        for (var name in icons) {
            if (icons.hasOwnProperty(name)) {
                icon(name, Object.extend(attrs, icons[name]));
                attrs.y += 37;
            }
        }
    };

    var radial = plump.radial = function(icons, attrs) {
        spokes = Object.size(icons);
        angle = 2*Math.PI / spokes;
        orig = {x: attrs.x, y: attrs.x};
        start = 0;
        for (var name in icons) {
            if (icons.hasOwnProperty(name)) {
                attrs.y = orig.y + attrs.r*Math.cos(start)/2;
                attrs.x = orig.x + attrs.r*Math.sin(start)/2;
                icon(name, Object.extend(attrs, icons[name]));
                start += angle;
            }
        }
    };

    /*
    // Display all icons
    for (var name in paths) {
        icon(name, x, y);
        x += 37;
        if (x > 407) {
            x = 0;
            y += 37;
        }
    }
    */

    return plump;
}(Raphael));

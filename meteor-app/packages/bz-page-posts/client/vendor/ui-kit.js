/**
 * Created by arutu_000 on 12/23/2015.
 */



/* BZ DROP TIPS */
bz.ui.initUiKit = function () {

  setTimeout(function () {

    toast(
      ['https://s3-us-west-1.amazonaws.com/buzzar/v0.5/public/vendor/shepherd/tether.js', function () {
        return window.Tether;
      }],
      ['http://github.hubspot.com/drop/dist/js/drop.js', function () {
        return window.Drop;
      }],
      function () {

        var _Drop, DropTooltip;

        _Drop = Drop.createContext({
          classPrefix: 'drop'
        });

        DropTooltip = function () {
          return $('.bz-tool-tip').each(function () {
            var $example, $target, content, drop, openOn, theme, isMobile, pos, bzClose;

            isMobile = $(window).width() < 890;
            pos = 'left middle';
            if (isMobile) pos = 'top center';

            $example = $(this);
            theme = $example.data('theme');
            openOn = $example.data('open-on') || 'click';
            if ($example.data('top-center')) pos = $example.data('top-center');
            $target = $example.find('.drop-target');
            $target.addClass(theme);
            content = $example.find('.drop-content').html();
            //bzClose = $('.bz-drop-close');
            bzClose = $example.find('.bz-drop-close');


            drop = new _Drop({
              target: $target[0],
              classes: theme,
              position: pos,
              constrainToWindow: true,
              constrainToScrollParent: false,
              openOn: openOn,
              content: content,
              remove: false
            });

            $(drop.drop).find('.bz-drop-close').click(function () {
              var d2 = drop;
              d2.close();
            });

            return drop;

          });

        };

        return DropTooltip();

      }
    );
  }, 100);


};

bz.ui.initCodeMirror = function (input, callback) {
  setTimeout(function () {
    //if (bz.config.isDev()) {
      toast(
        '/libs/codemirror/codemirror.css',
        '/libs/codemirror/htmleditor.css',
        ['/libs/codemirror/codemirror.js',
          function () {
            return CodeMirror;
          }],
        '/libs/codemirror/mode/markdown.js',
        '/libs/codemirror/mode/overlay.js',
        '/libs/codemirror/mode/xml.js',
        '/libs/codemirror/mode/gfm.js',
        '/libs/codemirror/marked.js',
        '/libs/codemirror/htmleditor.js',
        function () {
          var options = {
            height:200,
            markdown:true
          },
            htmlditor = UIkit.htmleditor(input, options);
          callback && callback(htmleditor);

          return window.markdown;
        }
      );
    /*} else {
      toast(
        ['https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.11.0/codemirror.min.css'],
        ['http://github.hubspot.com/drop/dist/js/drop.js', function () {
          return window.Drop;
        }],
        function () {

        }
      );
    }*/
  });
};

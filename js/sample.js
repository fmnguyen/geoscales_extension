// A script that just handles the interaction with
// DictionaryOfNumbers is included before this script load
var escapeRegexp = function(s) {
    return s.replace(/[\-\/\\\^$*+?.()|\[\]{}]/g, '\\$&');
};
chrome.extension.sendMessage(
    {
        type: 'state',
        url: window.location.href,
        tabId: ''
    },

    function(response) {
        if (response.isOn) {
            DictionaryOfNumbers.init();
            var $body = $('body');
            DictionaryOfNumbers.lookupInElement($body);

            var suggestionsCallback = function(allQuantities, $target, textFunction) {
                $target.siblings('.dictionary-of-numbers-suggestions:first').remove();

                // generate new suggestions html. unfortunately there was
                // a good reason why this couldn't be done using templates :(
                var $wrap = $('<div class="dictionary-of-numbers-suggestions"><div>Dictionary of Numbers<a href="#null" class="dictionary-of-numbers-remove" title="stop Dictionary of Numbers from running on the above box">x</a></div></div>'),
                    $table = $('<table>'),
                    isAny = false; // used to show if there are any suggestions
                _.each(allQuantities, function(result) {
                    if (!_.isEmpty(result.quantities)) {
                        isAny = true;
                        var quantities = result.quantities,
                            $tr = $('<tr>'),
                            $th = $('<th>'+ result.query +'</th>'),
                            $td = $('<td><ul>'),
                            $humanReadableList = $td.find('ul');

                        // add all the human readable version of this to the list
                        _.each(quantities, function(quantity) {
                            var $li = $('<li><a href="#null" data-parsed-query="'+ result.query +'"><span>&#8776;</span>'+ quantity.human_readable +'</a></li>');
                            $humanReadableList.append($li);
                        });

                        $tr.append($th);
                        $tr.append($td);
                        $table.prepend($tr);
                    }
                });
                if (isAny) {
                    // set up html events

                    // allow users to turn off asyoutype suggestions
                    $wrap.find('.dictionary-of-numbers-remove').on('click', function(evt) {
                        evt.preventDefault();
                        $target.addClass('dictionary-of-numbers-suggestions-off');
                        $wrap.remove();
                    });


                    // click on a suggestion and have it fill in the text
                    $table.find('td a').on('click', function(evt) {
                        evt.preventDefault();
                        var $link = $(evt.target);
                        var toReplace = $link.data('parsed-query');
                        var toReplaceRe = new RegExp(escapeRegexp(toReplace), 'g');
                        var linkText = $link.text();
                        var text = textFunction($target);
                        var newText = text.replace(
                            toReplaceRe,
                            toReplace +' ['+ linkText +']'
                        );
                        // replace the text with the quantity added
                        textFunction($target, newText);
                    });

                    // put the new element in the DOM
                    $wrap.append($table);
                    $target.after($wrap);
                }
            };
            var clearCallback = function($target) {
                $target.siblings('.dictionary-of-numbers-suggestions').remove();
            };
            // DictionaryOfNumbers.asYouType(
            //     $body.find('textarea'),
            //     'keyup',
            //     function ($target, newText) {
            //         if (newText) {
            //             return $target.val(newText);
            //         }
            //         return $target.val();
            //     },
            //     suggestionsCallback,
            //     clearCallback
            // );
            // DictionaryOfNumbers.asYouType(
            //     $('*[contenteditable="true"]'),
            //     'input',
            //     function ($target, newText) {
            //         if (newText) {
            //             return $target.html(newText);
            //         }
            //         return $target.html();
            //     },
            //     suggestionsCallback,
            //     clearCallback
            // );
        }
    }
);


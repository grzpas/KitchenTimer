/*

JQUERY: STOPWATCH & COUNTDOWN

This is a basic stopwatch & countdown plugin to run with jquery. Start timer, pause it, stop it or reset it. Same behaviour with the countdown besides you need to input the countdown value in seconds first. At the end of the countdown a callback function is invoked.

Any questions, suggestions? marc.fuehnen(at)gmail.com

*/
(function($){

    $.extend({

        APP : {

            formatTimer : function(a) {
                if (a < 10) {
                    a = '0' + a;
                }
                return a;
            },

            startTimer : function(hoursDisplaySelector, minutesDisplaySelector, secondsDisplaySelector, inputTime, callback) {
                // save type
                $.APP.hoursDisplaySelector = hoursDisplaySelector;
                $.APP.minutesDisplaySelector = minutesDisplaySelector;
                $.APP.secondsDisplaySelector = secondsDisplaySelector;
                $.APP.callback = callback;

                // get current date
                $.APP.d1 = new Date();

                switch($.APP.state) {

                    case 'pause' :

                        // resume timer
                        // get current timestamp (for calculations) and
                        // subtract time difference between pause and now
                        $.APP.t1 = $.APP.d1.getTime() - $.APP.td;

                    break;

                    default :
                        // get current timestamp (for calculations)
                        $.APP.t1 = $.APP.d1.getTime();
                        $.APP.t1 += inputTime*1000;
                    break;

                }
                // reset state
                $.APP.state = 'alive';
                // start loop
                $.APP.loopTimer();
            },

            pauseTimer : function() {

                // save timestamp of pause
                $.APP.dp = new Date();
                $.APP.tp = $.APP.dp.getTime();

                // save elapsed time (until pause)
                $.APP.td = $.APP.tp - $.APP.t1;
                // set state
                $.APP.state = 'pause';
            },


            resetTimer : function() {

                // reset display
                var selectors = $.APP.hoursDisplaySelector + "," + $.APP.minutesDisplaySelector + "," + $.APP.secondsDisplaySelector;
                $(selectors).html('00');

                // set state
                $.APP.state = 'reset';
            },

            endTimer : function(callback) {
                // set state
                $.APP.state = 'end';

                // invoke callback
                if (typeof callback === 'function') {
                    callback();
                }

            },

            loopTimer : function() {
                var td;
                var d2,t2;

                var ms = 0;
                var s  = 0;
                var m  = 0;
                var h  = 0;

                if ($.APP.state === 'alive') {

                    // get current date and convert it into
                    // timestamp for calculations
                    d2 = new Date();
                    t2 = d2.getTime();
                    td = $.APP.t1 - t2;
                    if (td <= 0) {
                        // if time difference is 0 end countdown
                        $.APP.endTimer(function(){
                            $.APP.resetTimer();
                            $.APP.callback();
                        });
                    }

                    // calculate milliseconds
                    ms = td%1000;
                    if (ms < 1) {
                        ms = 0;
                    } else {
                        // calculate seconds
                        s = (td-ms)/1000;
                        if (s < 1) {
                            s = 0;
                        } else {
                            // calculate minutes
                            m = (s-(s%60))/60;
                            if (m < 1) {
                                m = 0;
                            } else {
                                // calculate hours
                                 h = (m-(m%60))/60;
                                if (h < 1) {
                                    h = 0;
                                }
                            }
                        }
                    }

                    // subtract elapsed minutes & hours
                    ms = Math.round(ms/100);
                    s  = s-(m*60);
                    m  = m-(h*60);

                    // update display

                    $($.APP.hoursDisplaySelector).html($.APP.formatTimer(h));
                    $($.APP.minutesDisplaySelector).html($.APP.formatTimer(m));
                    $($.APP.secondsDisplaySelector).html($.APP.formatTimer(s));

                    // loop
                    $.APP.t = setTimeout($.APP.loopTimer,1);

                } else {

                    // kill loop
                    clearTimeout($.APP.t);
                    return true;

                }

            }

        }

    });

})(jQuery);


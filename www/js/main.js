(function() {
    alert('Hello Greg');
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var checkHour;
        var checkMinute;
        var checkSecond;
        // change to "/android_asset/www/alarm.mp3"
        var src="alarm.mp3";
        (function($){

            $.extend({

                APP : {

                    formatTimer : function(a) {
                        if (a < 10) {
                            a = '0' + a;
                        }
                        return a;
                    },

                    startTimer : function(dir, inputTime) {
                        // save type
                        $.APP.dir = dir;

                        // get current date
                        $.APP.d1 = new Date();

                        switch($.APP.state) {

                            case 'pause' :

                                // resume timer
                                // get current timestamp (for calculations) and
                                // substract time difference between pause and now
                                $.APP.t1 = $.APP.d1.getTime() - $.APP.td;

                                break;

                            default :

                                // get current timestamp (for calculations)
                                $.APP.t1 = $.APP.d1.getTime();

                                // if countdown add ms based on seconds in textfield
                                if ($.APP.dir === 'cd') {

                                    $.APP.t1 += inputTime*1000;
                                };

                                break;

                        }

                        // reset state
                        $.APP.state = 'alive';
                        $('#' + $.APP.dir + '_status').html('Running');

                        // start loop
                        $.APP.loopTimer();

                    },

                    pauseTimer : function() {

                        // save timestamp of pause
                        $.APP.dp = new Date();
                        $.APP.tp = $.APP.dp.getTime();

                        // save elapsed time (until pause)
                        $.APP.td = $.APP.tp - $.APP.t1;

                        // change button value
                        $('#' + $.APP.dir + '_start').val('Resume');

                        // set state
                        $.APP.state = 'pause';
                        $('#' + $.APP.dir + '_status').html('Paused');

                    },

                    stopTimer : function() {

                        // change button value
                        $('#' + $.APP.dir + '_start').val('Restart');

                        // set state
                        $.APP.state = 'stop';
                        $('#' + $.APP.dir + '_status').html('Stopped');

                    },

                    resetTimer : function() {

                        // reset display
                        $('#' + $.APP.dir + '_ms,#' + $.APP.dir + '_s,#' + $.APP.dir + '_m,#' + $.APP.dir + '_h').html('00');

                        // change button value
                        $('#' + $.APP.dir + '_start').val('Start');

                        // set state
                        $.APP.state = 'reset';
                        $('#' + $.APP.dir + '_status').html('Reset & Idle again');

                    },

                    endTimer : function(callback) {

                        // change button value
                        $('#' + $.APP.dir + '_start').val('Restart');

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

                            // calculate time difference between
                            // initial and current timestamp
                            if ($.APP.dir === 'sw') {
                                td = t2 - $.APP.t1;
                                // reversed if countdown
                            } else {
                                td = $.APP.t1 - t2;
                                if (td <= 0) {

                                    // if time difference is 0 end countdown
                                    $.APP.endTimer(function(){
                                        $.APP.resetTimer();

                                        src = "http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3";
                                        function onSuccess() {
                                            console.log("playAudio():Audio Success");

                                        }
                                        var media = new Media(src, onSuccess, null, null, null);
                                        media.play();
                                        //$.mobile.changePage('#popup', {transition: 'pop', role: 'dialog'});
                                        $('#' + $.APP.dir + '_status').html('Ended & Reset');

                                    });
                                }
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

                            // substract elapsed minutes & hours
                            ms = Math.round(ms/100);
                            s  = s-(m*60);
                            m  = m-(h*60);

                            // update display

                            $('#' + $.APP.dir + '_s').html($.APP.formatTimer(s));
                            $('#' + $.APP.dir + '_m').html($.APP.formatTimer(m));
                            $('#' + $.APP.dir + '_h').html($.APP.formatTimer(h));

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

            $('#cd_start').live('click', function() {

                if (!parseInt($('#cd_inputHours').val())*3600){
                    checkHour=0;
                }
                else{checkHour= parseInt($('#cd_inputHours').val())*3600;};


                if (!parseInt($('#cd_inputMinutes').val())*3600){
                    checkMinute=0;
                }
                else{checkMinute= parseInt($('#cd_inputMinutes').val())*60;};


                if (!parseInt($('#cd_inputSeconds').val())*10){
                    checkSecond=0;
                }
                else{checkSecond= parseInt($('#cd_inputSeconds').val());};

                var inputTime;

                inputTime = checkHour + checkMinute + checkSecond;

                if (inputTime==0){
                    //navigator.notification.alert('Please enter at least one value 2', function onSuccess() {}, "Click", "Ok");
                    alert('Please enter at least one value');
                }
                else{
                    $.APP.startTimer('cd', inputTime);

                };
            });

            $('#cd_stop').live('click', function() {
                $.APP.stopTimer();
            });

            $('#cd_reset').live('click', function() {
                $.APP.resetTimer();
            });

            $('#cd_pause').live('click', function() {
                $.APP.pauseTimer();
            });

        })(jQuery);

    }
})();


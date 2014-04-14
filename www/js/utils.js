function getTimeInSecondsFromTimeInput(timeInputSelector) {
    var time = getTimeFromTimeInput(timeInputSelector);
    return (time.hour * 3600) + (time.minute * 60) + time.second;
}

function getTimeFromTimeInput(timeInputSelector) {

    var time = {
        hour: 0,
        minute: 0,
        second: 0
    }

    var checkHour = 0, checkMinute = 0, checkSecond = 0;
    var value = $(timeInputSelector).val();
    var items = value.split(':');

    if (parseInt(items[0])) {
        checkHour = parseInt(items[0]);
    }
    if (parseInt(items[1])) {
        checkMinute = parseInt(items[1]);
    }

    if (parseInt(items[2])) {
        checkSecond = parseInt(items[2]);
    }

    time.hour = checkHour;
    time.minute = checkMinute;
    time.second = checkSecond;
    return time;
}

function getTimeString(hour, minute, second) {
    var hour = padLeft(hour, 2, 0);
    var minute = padLeft(minute, 2, 0);
    var second = padLeft(second, 2, 0);
    return hour + ':' + minute + ':' + second;
}


function padLeft(number, size, padCharacter) {
    var pad_char = typeof padCharacter !== 'undefined' ? padCharacter : '0';
    var pad = new Array(1 + size).join(padCharacter);
    return (pad + number).slice(-pad.length);
}

function resetForm(formName) {
    $(formName).find("input[type=text], input[type=hiddden], textarea").val("");
    $(formName).find("input[type=time]").val("00:00:00");
}


function playSound(audioElementId, audioSourceElement) {
    var fileNameSelector = $('#'+audioElementId );
    var audioSource = $('#'+audioSourceElement).val();
    fileNameSelector.attr('src', audioSource);
    var modifiedSrc = fileNameSelector.attr('src');
    document.getElementById(audioElementId).play();
    console.log('Sound ' +  modifiedSrc + "!");
}

function stopSound(fileName) {
    document.getElementById(fileName).src = '';
}

function getListViewContent(rs) {
    var result = '';
    for (var rowNo = 0; rowNo < rs.rows.length; rowNo++) {
        var row = rs.rows.item(rowNo);

        var htmlData = '<li id="' + row["id"] + '"><a href="#"><h2>' + row["name"] + ' [' + getTimeString(row["hour"], row["minute"],row["second"]) + ']</h2></a></li>';
        result+=htmlData;
    }
    return result;
}

/*(function () {
    navigator.notification = {
        alert: function (message, callback, title, buttonCaption) {
            alert(message);
        },
        confirm: function (message, callback, title, buttonCaption) {
            if (confirm(message) == true) {
                callback(1);
            } else {
                callback(2);
            }
        },
        vibrate: function(timeSpan) {
            console.log('Vibrating: ' + timeSpan);
        }
    };
})();*/
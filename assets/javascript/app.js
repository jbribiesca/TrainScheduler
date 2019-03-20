$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyCPQDVSecaDgGUmNrQrr85VoxOp7xuaoag",
        authDomain: "jbribiescadb.firebaseapp.com",
        databaseURL: "https://jbribiescadb.firebaseio.com",
        projectId: "jbribiescadb",
        storageBucket: "jbribiescadb.appspot.com",
        messagingSenderId: "970609866074"
    };

    firebase.initializeApp(config);

    var db = firebase.database();

    $("#updateTrain-btn").hide();
    $("#cancelTrain-btn").hide();

    $("#addTrain-btn").click(function (event) {
        event.preventDefault();

        var trainName = $("#train-name-input").val().trim();
        var trainDes = $("#destination-input").val().trim();
        var trainFirst = $("#first-train-input").val().trim();
        var trainFreq = $("#frequency-input").val().trim();

        var newTrain = {
            name: trainName,
            des: trainDes,
            first: trainFirst,
            freq: trainFreq
        };

        db.ref("/TrainScheduler").push(newTrain);

        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");

        $("#updateTrain-btn").hide();
        $("#trainForm").collapse("toggle");

    });

    $("#updateTrain-btn").click(function (event) {
        event.preventDefault();
        var tmpKey = $(this).attr("data-attr");
        var tmpRef = db.ref("TrainScheduler/" + tmpKey)

        var trainName = $("#train-name-input").val().trim();
        var trainDes = $("#destination-input").val().trim();
        var trainFirst = $("#first-train-input").val().trim();
        var trainFreq = $("#frequency-input").val().trim();

        var newTrain = {
            name: trainName,
            des: trainDes,
            first: trainFirst,
            freq: trainFreq
        };

        tmpRef.update(newTrain);

        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");

        $("#updateTrain-btn").hide();
        $("#addTrain-btn").show();
        $("#cancelTrain-btn").hide()
        $("#trainForm").collapse("toggle");

    });
    $("#cancelTrain-btn").click(function (event) {
        event.preventDefault();
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");
        $("#updateTrain-btn").hide();
        $("#addTrain-btn").show();
        $("#cancelTrain-btn").hide()
        $("#trainForm").collapse("toggle");
    })

    function formatRes(tmpData){
        var trainName = tmpData.val().name;
        var trainDes = tmpData.val().des;
        var trainFirst = tmpData.val().first;
        var trainFreq = tmpData.val().freq;
        var trainKey = tmpData.key;

        var firstTimeConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % trainFreq;
        var tMinutesTillTrain = trainFreq - tRemainder;
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        var newRow = $("<tr>").attr("ID", trainKey).append(
            $("<button>").addClass("trainEditActions").text("Edit").attr("data-attr", trainKey),
            $("<td>").text(trainName),
            $("<td>").text(trainDes),
            $("<td>").text(trainFreq),
            $("<td>").text(moment(nextTrain).format("hh:mm")),
            $("<td>").text(tMinutesTillTrain),
            $("<button>").addClass("trainActions").text("Delete").attr("data-attr", trainKey),
        );

        $("#trains").append(newRow);
    }

    db.ref("TrainScheduler/").on("child_added", function (childSnapshot) {
        formatRes(childSnapshot)
    });

    db.ref("TrainScheduler/").on("child_changed", function (childSnapshot) {
        var trainKey = childSnapshot.key;
        $("#" + trainKey).remove();
        formatRes(childSnapshot)
    });

    db.ref("TrainScheduler/").on("child_removed", function (childSnapshot) {
        var trainKey = childSnapshot.key;
        $("#" + trainKey).remove();
    });

    $(document).on("click", ".trainActions", function () {
        var tmpKey = $(this).attr("data-attr");
        db.ref("TrainScheduler/" + tmpKey).remove();
    });

    $(document).on("click", ".trainEditActions", function () {
        var tmpKey = $(this).attr("data-attr");
        var tmpRef = db.ref("TrainScheduler/" + tmpKey)

        tmpRef.once("value", function (snapshot) {
                var trainName = snapshot.val().name;
                var trainDes = snapshot.val().des;
                var trainFirst = snapshot.val().first;
                var trainFreq = snapshot.val().freq;

                $("#train-name-input").val(trainName);
                $("#destination-input").val(trainDes);
                $("#first-train-input").val(trainFirst);
                $("#frequency-input").val(trainFreq);
            
        })

        $("#trainForm").collapse("toggle");
        $("#updateTrain-btn").attr("data-attr", tmpKey)
        $("#updateTrain-btn").show()
        $("#cancelTrain-btn").show()
        $("#addTrain-btn").hide()
  
    });

    setInterval(updatePage, 1000 * 60);
    function updatePage() {
        $("#trains").empty();
        db.ref("TrainScheduler/").once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                formatRes(childSnapshot)
            })
        })
    }
});

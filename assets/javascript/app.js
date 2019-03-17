
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

});

db.ref("TrainScheduler/").on("child_added", function(childSnapshot) {

    var trainName = childSnapshot.val().name;
    var trainDes = childSnapshot.val().des;
    var trainFirst = childSnapshot.val().first;
    var trainFreq = childSnapshot.val().freq;


    var firstTimeConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % trainFreq;
    var tMinutesTillTrain = trainFreq - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDes),
        $("<td>").text(trainFreq),
        $("<td>").text(moment(nextTrain).format("hh:mm")),
        $("<td>").text(tMinutesTillTrain)
    );

    $("#trains").append(newRow);

});
DB_URI = 'db.csv'
CORRECT = String.fromCodePoint(0x2705)
WRONG = String.fromCodePoint(0x274C)

let session = { data: null, idx: 0, indices: null, correctList: null, wrongList: null, state: 0 }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetSession() {
    let parsedData = Papa.parse(csvData, { header: true });
    session.data = parsedData.data;
    session.indices = [...Array(session.data.length).keys()]
    shuffleArray(session.indices)
    session.idx = 0;
    session.state = 1
    session.correctList = [];
    session.wrongList = [];
}

function submitResponse(inf, pret, perf) {
    currentWord = session.data[session.indices[session.idx]];
    if (currentWord['inf'] == inf && currentWord['pret'] == pret && currentWord['perf'] == perf) {
        session.correctList.push(session.indices[session.idx])
    } else {
        session.wrongList.push(session.indices[session.idx])
    }
    return currentWord
}

function nextWord() {
    session.idx++;
}

function updateUI() {
    // Run out of words!
    if (session.idx == session.data.length) {
        // Show results and perhaps reset the session!
        alert(`Correct ${session.correctList.length}/${session.data.length}!`)
        resetSession()
    }

    if (session.state == 1) {
        document.getElementById("cz").innerText = session.data[session.indices[session.idx]]['en']
        document.getElementById('inf').value = ""
        document.getElementById('pret').value = ""
        document.getElementById('perf').value = ""
        document.getElementById('inf').readOnly = false
        document.getElementById('pret').readOnly = false
        document.getElementById('perf').readOnly = false
        document.getElementById('infCorrect').style.visibility = "hidden"
        document.getElementById('pretCorrect').style.visibility = "hidden"
        document.getElementById('perfCorrect').style.visibility = "hidden"
        document.getElementById('infImg').style.visibility = "hidden"
        document.getElementById('pretImg').style.visibility = "hidden"
        document.getElementById('perfImg').style.visibility = "hidden"
        document.getElementById('inf').focus()
    } else if (session.state == 2) {
        infU = document.getElementById('inf')
        pretU = document.getElementById('pret')
        perfU = document.getElementById('perf')
        res = submitResponse(infU.value, pretU.value, perfU.value)
        infImg = document.getElementById('infImg')
        pretImg = document.getElementById('pretImg')
        perfImg  = document.getElementById('perfImg')
        infC = document.getElementById('infCorrect')
        pretC = document.getElementById('pretCorrect')
        perfC  = document.getElementById('perfCorrect')
        answerString(infImg, infC, infU, res['inf'])
        answerString(pretImg, pretC, pretU, res['pret'])
        answerString(perfImg, perfC, perfU, res['perf'])
    }
}

document.addEventListener("DOMContentLoaded", function () {
    resetSession();
    updateUI();
    session.state = 2;
    submitButton = document.getElementById('submit');
    submitButton.onclick = butSubmitClicked
    document.getElementById('inf').focus()
})

// Execute a function when the user releases a key on the keyboard
document.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    butSubmitClicked();
  }
});

function answerString(img, textUI, user, correct) {
    img.style.visibility = "visible"
    user.readOnly = true
    if (user.value === correct) {
        img.src = "correct.bmp";
    } else {
        img.src = "wrong.bmp"
        textUI.style.visibility = "visible"
        textUI.innerText = correct;
    }
}

// UI functions
function butSubmitClicked() {
    if (session.state == 0) {
        alert("This should never happen!")
    } else if (session.state == 1) {
        nextWord()
        updateUI()
        session.state = 2;
    } else if (session.state == 2) {
        updateUI()
        session.state = 1;
    }

}

// Wrapper for slickQuiz to function as a simple reveal.js-plugin

const script = document.currentScript;
const scriptURL = script.src;

RevealQuiz = {
    id: 'RevealQuiz',
    init: function (reveal) { init(function () { prepareQuizzes(reveal.getConfig().quiz || {}); }); }
};

function init(callback) {
    const scriptJQuery = scriptURL + '/../jquery.min.js';
    const scriptQuiz = scriptURL + '/../slickQuiz.js';

    loadJS(scriptJQuery, function () {
        loadJS(scriptQuiz, function () {
            callback();
        });
    });
}

function loadJS(href, callback) {
    var head = document.getElementsByTagName('head')[0];

    var script = document.createElement('script');
    script.src = href;
    script.type = 'text/javascript';

    if (callback instanceof Function) {
        script.onload = function () {
            callback();
        };
    }

    head.append(script);
}

function prepareQuizzes(config) {
    init(function () {
        $(function () {
            const quizzes = document.getElementsByClassName("quizInstance");
            const numberOfQuizzes = quizzes.length;

            for (var i = 0; i < numberOfQuizzes; i++) {
                const quizId = "slickQuiz-" + i;
                const canvasId = quizId + "-result"

                quizzes[i].id = quizId;

                height = Reveal.getConfig().height;
                parent = quizzes[i].parentNode;
                quizArea = quizzes[i].getElementsByClassName('quizArea')[0];
                quizArea.style.height = 0;
                remainingHeight = height - parent.offsetHeight;
                quizArea.style.height = remainingHeight + 'px';

                quizResults = quizzes[i].getElementsByClassName('quizResults')[0];
                quizResults.style.height = remainingHeight + 'px';

                resultChartCanvasNode = quizzes[i].getElementsByClassName("quizResultChart")[0];
                resultChartCanvasNode.id = canvasId;

                const quizSource = quizzes[0].getElementsByTagName("script")[0].textContent;
                eval(quizSource);

                slickQuizConfig = config.slickQuiz;

                var currQuiz = quiz;
                slickQuizConfig.json = currQuiz;

                slickQuizConfig.events = {
                    onStartQuiz: function (options) { },
                    onCompleteQuiz: function (result) { createResult(result, config, canvasId); }
                }

                slickQuizConfig.animationCallbacks = {
                    setupQuiz: function () { Reveal.layout(); },
                    startQuiz: function () { Reveal.layout(); },
                    resetQuiz: function () { Reveal.layout(); },
                    checkAnswer: function () { Reveal.layout(); showCorrectAnswer(quizId); },
                    nextQuestion: function () { Reveal.layout(); },
                    backToQuestion: function () { Reveal.layout(); },
                    completeQuiz: function () { Reveal.layout(); }
                },

                $('#' + quizId).slickQuiz(slickQuizConfig);

            }
        });
    });
}


function showCorrectAnswer(quizId)
{
    currentQuiz = document.getElementById(quizId);

    incorrectAnswers = currentQuiz.querySelectorAll('.quizArea .questions .complete .answers .incorrect');
    for (answer of incorrectAnswers)
    {
        if (answer.getElementsByTagName('input')[0].checked)
        {
            answer.className += " checked";
        }
    }

    correctAnswers = currentQuiz.querySelectorAll('.quizArea .questions .complete .answers .correct');
    for (answer of correctAnswers)
    {
        if (!answer.getElementsByTagName('input')[0].checked)
        {
            answer.className += " unchecked";
        }
    }
}

function createNewChart(config, canvas_id)
{
    return new Chart(document.getElementById(canvas_id).getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['correct', 'incorrect'],
            datasets: [{
                label: 'Quiz result',
                backgroundColor: [config.revealQuiz.correctColor, config.revealQuiz.incorrectColor],
                borderWidth: 12,
                data: [0, 1]
            }]
        },
        options: {
            legend: { display: false },
            tooltips: { enabled: false },
            events: []
        }
    });
}

function createResult(result, config, canvas_id)
{
    var numberQuestions = result.questionCount;
    var correctAnswers = result.score;
    var wrongAnswers = numberQuestions - correctAnswers;

    createResult.charts = (createResult.charts === undefined) ? {} : createResult.charts;

    if (typeof createResult.charts[canvas_id] != 'object') {
        createResult.charts[canvas_id] = createNewChart(config, canvas_id);
        Chart.pluginService.register({
            beforeDraw: function (chart) {
                var width = chart.chart.width,
                    height = chart.chart.height,
                    ctx = chart.chart.ctx;

                var correctAnswers = chart.data.datasets[0].data[0];
                var wrongAnswers = chart.data.datasets[0].data[1];
                var numberQuestions = correctAnswers + wrongAnswers;

                ctx.restore();
                var fontSize = (height / 150).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                ctx.textBaseline = "middle";

                var text = String(correctAnswers) + "/" + String(numberQuestions),
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2;

                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        });
    }
    createResult.charts[canvas_id].data.datasets[0].data = [correctAnswers, wrongAnswers];
    createResult.charts[canvas_id].update();
}
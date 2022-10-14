function SecondDiagram() {
    let N = 128;
    let K = N / 4;
    let M = [];
    let values = [[]];
    let X1 = [];
    let X2 = [];
    let fi = Math.PI / 16;
    let A = [];

    let tempM = K;
    while (tempM < N) {
        M.push(tempM);
        tempM += N / 32;
    }
    M.push(N - 1);

    var ctx = document.getElementById("myChartSecond");
    var myChartSecond = new Chart(ctx, {
        type: "line",
        data: {
            labels: [], //Подписи оси x
            datasets: [],
        },
        options: {
            responsive: false, //Вписывать в размер canvas
            scales: {
                xAxes: [
                    {
                        display: true,
                    },
                ],
                yAxes: [
                    {
                        display: true,
                    },
                ],
            },
        },
    });

    var ctxA = document.getElementById("myChartSecondA");
    var myChartSecondA = new Chart(ctxA, {
        type: "line",
        data: {
            labels: [], //Подписи оси x
            datasets: [],
        },
        options: {
            responsive: false, //Вписывать в размер canvas
            scales: {
                xAxes: [
                    {
                        display: true,
                    },
                ],
                yAxes: [
                    {
                        display: true,
                    },
                ],
            },
        },
    });

    for (let k = 0; k < M.length; k += 1) {
        values[k] = [];
    }

    myChartSecond.data.datasets[0] = {
        label: "A) X_SKZ ",
        data: [],
        borderColor: "blue",
        borderWidth: 3,
        fill: false,
    };

    myChartSecond.data.datasets[1] = {
        label: "B) X_SKZ ",
        data: [],
        borderColor: "red",
        borderWidth: 3,
        fill: false,
    };

    myChartSecondA.data.datasets[0] = {
        label: "Error A",
        data: [],
        borderColor: "blue",
        borderWidth: 3,
        fill: false,
    };

    //Заполняем данными
    for (var n = 0.0; n < N; n += 1) {
        for (let k = 0; k < M.length; k += 1) {
            let value = calculateSecond(n).toFixed(2);

            if (n <= M[k]) {
                values[k].push(value);
            }
        }
    }

    for (let k = 0; k < M.length; k += 1) {
        evaluateSqrVal(k);
    }
    //Обновляем
    myChartSecond.update();
    myChartSecondA.update();

    function calculateSecond(n) {
        //Вычисление нужной функции
        return Math.sin((2 * Math.PI * n) / N + fi);
    }

    function evaluateSqrVal(k) {
        let container = document.getElementById("sqrValWithFi");
        const q = 0.707;
        let span = k + 1 + ") a) X_SKZ = ";

        let sum1 = values[k].reduce(
            (previousValue, currentValue) =>
                Math.abs(parseFloat(previousValue)) +
                parseFloat(currentValue) ** 2
        );

        let sqr1 = sum1 / (M[k] + 1);
        Xskz1 = Math.sqrt(sqr1);
        X1[k] = Math.abs(q - Xskz1);
        myChartSecond.data.labels.push(M[k]);
        myChartSecond.data.datasets[0].data.push(X1[k]);

        let a1 = amplitude(k);
        A[k] = Math.abs(1 - a1);

        span += Xskz1 + ", error SKZ = " + X1[k] + " б) X_SKZ = ";

        let sum2 = values[k].reduce(
            (previousValue, currentValue) =>
                parseFloat(previousValue) + parseFloat(currentValue)
        );

        let sqr2 = sqr1 - (sum2 / (M[k] + 1)) ** 2;
        Xskz2 = Math.sqrt(sqr2);

        X2[k] = Math.abs(q - Xskz2);
        myChartSecond.data.datasets[1].data.push(X2[k]);

        span +=
            Xskz2 +
            ", error SKZ = " +
            X2[k] +
            " A = " +
            a1 +
            ", error A = " +
            A[k];

        myChartSecondA.data.labels.push(M[k]);
        myChartSecondA.data.datasets[0].data.push(A[k]);

        let elemSpan = document.createElement("span");
        elemSpan.append(span);
        container.append(elemSpan);

        console.log(span);
    }

    function amplitude(k) {
        let sinSum = 0;
        let cosSum = 0;
        for (let i = 0; i < M[k]; i++) {
            let value = parseFloat(values[k][i]);
            let angle = (2 * Math.PI * i) / N;
            sinSum += value * Math.sin(angle);
            cosSum += value * Math.cos(angle);
        }

        let sum = Math.sqrt(
            Math.pow((sinSum * 2) / N, 2) + Math.pow((cosSum * 2) / N, 2)
        );

        return sum;
    }
}

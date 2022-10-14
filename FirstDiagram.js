function FirstDiagram() {
    let N = 128;
    let K = N / 4;
    let M = [];
    let values = [[]];
    let X1 = [];
    let X2 = [];
    let A = [];

    let tempM = K;
    while (tempM < N) {
        M.push(tempM);
        tempM += N / 32;
    }
    M.push(N - 1);
    console.log(M)

    var ctx = document.getElementById("myChartFirst");
    var myChartFirst = new Chart(ctx, {
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

    var ctxA = document.getElementById("myChartFirstA");
    var myChartFirstA = new Chart(ctxA, {
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

    myChartFirst.data.datasets[0] = {
        label: "A) X_SKZ ",
        data: [],
        borderColor: "blue",
        borderWidth: 3,
        fill: false,
    };

    myChartFirst.data.datasets[1] = {
        label: "B) X_SKZ ",
        data: [],
        borderColor: "red",
        borderWidth: 3,
        fill: false,
    };

    myChartFirstA.data.datasets[0] = {
        label: "Error A",
        data: [],
        borderColor: "blue",
        borderWidth: 3,
        fill: false,
    };

    // Считаем значение
    for (var n = 0.0; n < N; n += 1) {
        let value = calculateFirst(n).toFixed(2);
        for (let k = 0; k < M.length; k += 1) {
            if (n <= M[k]) {
                values[k].push(value);
            }
            // console.log(values[k]);
        }
    }

    for (let k = 0; k < M.length; k += 1) {
        evaluateSqrVal(k);
    }
    //Обновляем
    myChartFirst.update();
    myChartFirstA.update();

    function calculateFirst(n) {
        //Вычисление нужной функции
        return Math.sin((2 * Math.PI * n) / N);
    }

    function evaluateSqrVal(k) {
        const q = 0.707;
        let container = document.getElementById("sqrVal");
        let span = k + 1 + ") A) X_SKZ = ";

        let sum1 = values[k].reduce(
            (previousValue, currentValue) =>
                parseFloat(previousValue) + parseFloat(currentValue) ** 2
        );

        let sqr1 = sum1 / (M[k] + 1);
        Xskz1 = Math.sqrt(sqr1);
        X1[k] = Math.abs(q - Xskz1);
        myChartFirst.data.labels.push(M[k]);
        myChartFirst.data.datasets[0].data.push(X1[k]);

        console.log(X1[k]);

        let a1 = amplitude(k);
        A[k] = Math.abs(1 - a1);

        span += Xskz1 + ", error SKZ = " + X1[k] + " B) X_SKZ = ";

        let sum2 = values[k].reduce(
            (previousValue, currentValue) =>
                parseFloat(previousValue) + parseFloat(currentValue)
        );

        let sqr2 = sqr1 - (sum2 / (M[k] + 1)) ** 2;
        Xskz2 = Math.sqrt(sqr2);

        X2[k] = Math.abs(q - Xskz2);
        myChartFirst.data.datasets[1].data.push(X2[k]);

        span +=
            Xskz2 +
            ", error SKZ = " +
            X2[k] +
            " A = " +
            a1 +
            ", error A = " +
            A[k];

        myChartFirstA.data.labels.push(M[k]);
        myChartFirstA.data.datasets[0].data.push(A[k]);

        let elemSpan = document.createElement("span");
        elemSpan.append(span);
        container.append(elemSpan);
        console.log(span)
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

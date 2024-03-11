class glassmorphism{
    constructor(){
        var btns = document.getElementsByClassName("btn");
        function rangeTranslate(n, x, y){
            var OldRange = (x[1] - x[0]);
            var NewRange = (y[1] - y[0]);
            return (((n - x[0]) * NewRange) / OldRange) + y[0];
        }
        for (let i = 0; i < btns.length; i++) {
            const element = btns[i];
            element.classList.add("glassmorphism");
            var offset = getBoundingClientRectObject(element);


            // var leftOfWidth = -(offset.left / window.innerWidth * 100);
            // var rightOfWidth = 100 + (offset.right / window.innerWidth * 100);

            var boxSize = [offset.left, offset.right];
            var windowSize = [0, window.innerWidth];

            // console.log(rangeTranslate(leftOfWidth, windowSize, boxSize));

            var offsetLeft = (windowSize[0] - boxSize[0]) / windowSize[1] * 100;
            var left = offsetLeft * windowSize[1] / offset.width / 100;
            

            // var left = rangeTranslate(windowSize[0] - boxSize[0], boxSize, 0, 100);
            console.log(left);
            var right = 200;

            element.style.background = `linear-gradient(90deg, rgb(0, 207, 255) ${left}%, rgb(255, 100, 179) ${right}%)`;
        }
        // var welcome = document.getElementsByClassName("welcome");
        // welcome.classList.add("glassmorphism");
    }
}

// on newly added buttons (to DOM) class wouldn't be applied.
// setTimeout(() => {
//     const ok = new glassmorphism();
// }, 1000);

// I couldn't solve the equation
// I'm stupid
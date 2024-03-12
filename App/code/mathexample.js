const big = document.createElement("big");
big.style.position = "absolute";
big.style.width = "100%";
big.style.height = "100%";
big.style.top = "0";
big.style.left = "0";
big.style.zIndex = "60";
big.style.background = "#222";
app.appendChild(big);

const small = document.createElement("small");
small.style.position = "absolute";
small.style.width = "300px";
small.style.height = "200px";
small.style.top = "120px";
small.style.left = "100px";
small.style.zIndex = "65";
small.style.background = "#58da97";
app.appendChild(small);

function rangeTranslate(n, x, y){
    var OldRange = (x[1] - x[0]);
    var NewRange = (y[1] - y[0]);
    return (((n - x[0]) * NewRange) / OldRange) + y[0];
}

var smallOffset = small.getBoundingClientRect(); 

var left = (-smallOffset.left);

left = rangeTranslate(left,
    [smallOffset.left, smallOffset.right],
    [0, window.innerWidth]
    );

left = left / smallOffset.width * 100;

console.log(left);

var right = (window.innerWidth - smallOffset.right);

right = rangeTranslate(right, 
    [smallOffset.left, smallOffset.right],
    [0, window.innerWidth]
);

right = right / smallOffset.width * 100;
console.log(right);


big.style.background = "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 100%)";
// small.style.background = `linear-gradient(90deg, rgba(2,0,36,1) ${left}%, rgba(0,212,255,1) ${right}%)`;
small.style.background = `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 100%)`;



small.style.backgroundSize = "cover";
small.style.backgroundPosition = "center";
small.style.backgroundAttachment = "fixed";
small.style.backgroundRepeat = "no-repeat";



// left: -96%      
// right: 344%

// el_left: 300px
// el_right: 600px

// window.innerWidth: 1350 px



// left: -32%
// right: 206%

// el_left: 100px
// el_right: 400px

// window.innerWidth: 728  px
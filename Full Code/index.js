// Waits for the HTML document to be fully loaded before running the game
document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    const grid = document.querySelector(".grid"); // Selects the grid container
    const scoreDisplay = document.getElementById("score"); // Selects the score display
    const width = 8; // Defines the width of the grid (8x8)
    const squares = []; // Stores all candy squares
    let score = 0; // Initializes score to zero

    // Array of candy image paths
    const candyColors = [
        "url(utils/red-candy.png)",
        "url(utils/blue-candy.png)",
        "url(utils/green-candy.png)",
        "url(utils/yellow-candy.png)",
        "url(utils/orange-candy.png)",
        "url(utils/purple-candy.png)",
    ];

    // Function to create the game board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div"); // Creates a new div for each grid cell
            square.setAttribute("draggable", true); // Makes the square draggable
            square.setAttribute("id", i); // Assigns a unique ID to each square
            
            // Assigns a random candy color
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];

            grid.appendChild(square); // Adds the square to the grid
            squares.push(square); // Stores the square in the array
        }
    }
    createBoard(); // Calls the function to generate the board

    // Variables for dragging functionality
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    // Event listeners for drag and drop functionality
    squares.forEach((square) => square.addEventListener("dragstart", dragStart));
    squares.forEach((square) => square.addEventListener("dragend", dragEnd));
    squares.forEach((square) => square.addEventListener("dragover", dragOver));
    squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
    squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
    squares.forEach((square) => square.addEventListener("drop", dragDrop));

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) {
        e.preventDefault(); // Prevents default behavior to allow drop
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.style.backgroundImage = "";
    }

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    // Moves candies down when matches are cleared
    function moveIntoSquareBelow() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
            }
        }
    }

    // Check for row of four
    function checkRowForFour() {
        for (let i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                rowOfFour.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    // Runs the game loop
    window.setInterval(function () {
        checkRowForFour();
        moveIntoSquareBelow();
    }, 100);
}

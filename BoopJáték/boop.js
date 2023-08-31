
const canvas = document.getElementById('boopCanvas')
const context = canvas.getContext('2d')

const startButton = document.getElementById('startbutton')
const beforeStart = document.getElementById('beforeStart')
const restartButton = document.getElementById('restartbutton')
restartButton.style.display = "none"
let winningScore = 5
gameStarted = false
const cellSize = 100
const boardSize = cellSize * 6 
const paddingTop = 100
const paddingSide = 300

startButton.onclick = startGame
restartButton.onclick = restartGame

class Player{

    catImage

    constructor(name, cats, imageLocation){
        this.name = name
        this.cats = cats
        this.catPositions = []
        this.catImage = new Image()
        this.catImage.src = imageLocation
        this.score = 0
    }
}

let players = []
let board = Array(6).fill().map(() => Array(6).fill(false))
turn = 0

function placeCat(event){
    if(gameStarted){
        const currentPlayer = players[turn % 2]

        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        if (x >= paddingSide && x < canvas.width - paddingSide && y >= paddingTop && y < canvas.height - paddingTop){
            const col = Math.floor((x - paddingSide) / cellSize)
            const row = Math.floor((y - paddingTop) / cellSize)

            if (!board[row][col] && currentPlayer.cats > 0){
                board[row][col] = true
                currentPlayer.catPositions.push([row, col])
                currentPlayer.cats -= 1

                turn++
                pushNeighborCats(row, col)
                checkPoint()
                draw()
                checkWinner()
            }
        } 
    }
}

canvas.addEventListener('click', placeCat)

function pushNeighborCats(row, col){
    const catsToDelete = []
    for (let i = -1; i <= 1; i++){
        for (let j = -1; j <= 1; j++){
            const row1 = row + i
            const col1 = col + j
  
            if (row1 < 0 || row1 > 5 || col1 < 0 || col1 > 5 || (i === 0 && j === 0)){
                continue
            }
            if (board[row1][col1]) {
                const row2 = row1 + i
                const col2 = col1 + j
                
                //Lecsúszik a cica a pályáról
                if (row2 < 0 || row2 > 5 || col2 < 0 || col2 > 5) {
                    catsToDelete.push([row1, col1])
                }

                //Arrébb csúszik a cica
                else if(!board[row2][col2] && board[row1][col1]){
                    board[row2][col2] = true
                    board[row1][col1] = false
                    const player = players.find(p => p.catPositions.some(([r, c]) => r === row1 && c === col1))
                    const indexToUpdate = player.catPositions.findIndex(([r, c]) => r === row1 && c === col1)
                    player.catPositions[indexToUpdate] = [row2, col2]
                }
            }
        }
    }
  
    catsToDelete.forEach(([catRow, catCol]) => {
        const player = players.find(p => p.catPositions.some(([r, c]) => r === catRow && c === catCol))
        player.cats++
        board[catRow][catCol] = false
        const indexToRemove = player.catPositions.findIndex(([r, c]) => r === catRow && c === catCol)
        player.catPositions.splice(indexToRemove, 1)
    })
  
    draw()
}

function checkPoint() {
    //Függőleges ellenőrzés
    for (let row = 0; row < board.length - 2; row++){
        for (let col = 0; col < board.length; col++){
            const playersWithCats = players.filter((p) =>
                p.catPositions.some(([r, c]) => r === row && c === col) &&
                p.catPositions.some(([r, c]) => r === row+1 && c === col) &&
                p.catPositions.some(([r, c]) => r === row+2 && c === col)
            );
  
            if (playersWithCats.length === 1){
                const player = playersWithCats[0]
                player.score++
                player.cats += 3
                player.catPositions = player.catPositions.filter(
                    ([r, c]) => !(r === row && c === col) && !(r === row+1 && c === col) && !(r === row+2 && c === col)
                )
                board[row][col] = false
                board[row+1][col] = false
                board[row+2][col] = false
                return true
            }
        }
    }
    //Vízszintes ellenőrzés
    for (let row = 0; row < board.length; row++){
        for (let col = 0; col < board.length - 2; col++){
            const playersWithCats = players.filter((p) =>
                p.catPositions.some(([r, c]) => r === row && c === col) &&
                p.catPositions.some(([r, c]) => r === row && c === col+1) &&
                p.catPositions.some(([r, c]) => r === row && c === col+2)
            );
  
            if (playersWithCats.length === 1){
                const player = playersWithCats[0]
                player.score++
                player.cats += 3
                player.catPositions = player.catPositions.filter(
                    ([r, c]) => !(r === row && c === col) && !(r === row && c === col+1) && !(r === row && c === col+2)
                )
                board[row][col] = false
                board[row][col+1] = false
                board[row][col+2] = false
                return true
            }
        }
    }
    //Átlós ellenőrzés 1
    for (let row = 0; row < board.length-2; row++){
        for (let col = 0; col < board.length - 2; col++){
            const playersWithCats = players.filter((p) =>
                p.catPositions.some(([r, c]) => r === row && c === col) &&
                p.catPositions.some(([r, c]) => r === row+1 && c === col+1) &&
                p.catPositions.some(([r, c]) => r === row+2 && c === col+2)
            );
  
            if (playersWithCats.length === 1){
                const player = playersWithCats[0]
                player.score++
                player.cats += 3
                player.catPositions = player.catPositions.filter(
                    ([r, c]) => !(r === row && c === col) && !(r === row+1 && c === col+1) && !(r === row+2 && c === col+2)
                )
                board[row][col] = false
                board[row+1][col+1] = false
                board[row+2][col+2] = false
                return true
            }
        }
    }
    //Átlós ellenőrzés 2
    for (let row = 0; row < board.length - 2; row++){
        for (let col = 0; col < board.length - 2; col++){
            const playersWithCats = players.filter((p) =>
                p.catPositions.some(([r, c]) => r === row+2 && c === col) &&
                p.catPositions.some(([r, c]) => r === row+1 && c === col+1) &&
                p.catPositions.some(([r, c]) => r === row && c === col+2)
            );
  
            if (playersWithCats.length === 1){
                const player = playersWithCats[0]
                player.score++
                player.cats += 3
                player.catPositions = player.catPositions.filter(
                    ([r, c]) => !(r === row+2 && c === col) && !(r === row+1 && c === col+1) && !(r === row && c === col+2)
                )
                board[row+2][col] = false
                board[row+1][col+1] = false
                board[row][col+2] = false
                return true
            }
        }
    }
    return false
}

function checkWinner(){
    for (let i = 0; i < 2; i++){
        if (players[i].score >= winningScore || players[(i+1)%2].cats === 0){
            context.fillStyle = "lightblue"
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.fillStyle = "black"
            context.font = "bold 80px Arial"
            context.textAlign = "center"
            context.fillText(`A győztes: ${players[i].name}!`, canvas.width/2, canvas.height/2)
            
            restartButton.style.display = "block"
            gameStarted = false
        }
    }
}
  

function drawBoard(){
    context.fillStyle = "lightblue"
    context.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < 6; i++){
        for (let j = 0; j < 6; j++){
            const x = paddingSide + j * cellSize
            const y = paddingTop + i * cellSize
            context.strokeRect(x, y, cellSize, cellSize)
        }
    }

    context.fillStyle = "teal"
    context.font = "bold 80px Arial"
    context.textAlign = "center"
    context.fillText("boop", canvas.width/2, 70)
}

function drawPens(){
    const penSize = cellSize * 2

    const pen1X = 50
    const pen1Y = 300
    context.fillStyle = "lightgreen"
    context.fillRect(pen1X, pen1Y, penSize, penSize)

    context.fillStyle = "black"
    context.font = "bold 16px Arial"
    context.textAlign = "start"
    context.fillText(players[0].name, pen1X, pen1Y - 10)
    context.fillText("Pontok: " + players[0].score, pen1X, pen1Y + 220)

    for (let i = 0; i < players[0].cats; i++){
        const x = pen1X + (i % 4) * cellSize/2
        const y = pen1Y + 50 + Math.floor(i / 4) * cellSize/2
        context.drawImage(players[0].catImage, x, y, cellSize/2, cellSize/2)
    }

    const pen2X = canvas.width - 50 - penSize
    const pen2Y = 300
    context.fillStyle = "lightgreen"
    context.fillRect(pen2X, pen2Y, penSize, penSize)

    context.fillStyle = "black"
    context.font = "bold 16px Arial"
    context.textAlign = "start"
    const nameWidth = context.measureText(players[1].name).width
    context.fillText(players[1].name, pen2X + penSize - nameWidth, pen2Y - 10)
    const pointWidth = context.measureText("Pontok: " + players[1].score).width
    context.fillText("Pontok: " + players[1].score, pen2X + penSize - pointWidth, pen2Y + 220)

    for (let i = 0; i < players[1].cats; i++){
        const x = pen2X + (i % 4) * cellSize/2
        const y = pen2Y + 50 + Math.floor(i / 4) * cellSize/2
        context.drawImage(players[1].catImage, x, y, cellSize/2, cellSize/2)
    }
}

function drawCats(){
    for(let catPosition of players[0].catPositions){
        const catX = paddingSide + catPosition[1] * cellSize
        const catY = paddingTop + catPosition[0] * cellSize
        context.drawImage(players[0].catImage, catX, catY, cellSize, cellSize)
    }

    for(let catPosition of players[1].catPositions){
        const catX = paddingSide + catPosition[1] * cellSize
        const catY = paddingTop + catPosition[0] * cellSize
        context.drawImage(players[1].catImage, catX, catY, cellSize, cellSize)
    }
}
    
function draw(){
    drawBoard()
    drawPens()
    drawCats()
}

function startGame(){
    const player1Name = document.getElementById('player1').value
    const player2Name = document.getElementById('player2').value
    winningScore = document.getElementById('winningscore').value
    players.push(new Player(player1Name, 8, "./assets/cat1.png"))
    players.push(new Player(player2Name, 8, "./assets/cat2.png"))
    beforeStart.style.display = "none"
    gameStarted = true
    draw()
}

function restartGame(){
    players[0].cats = 8
    players[0].catPositions = []
    players[0].score = 0
    players[1].cats = 8
    players[1].catPositions = []
    players[1].score = 0

    board = Array(6).fill().map(() => Array(6).fill(false))
    turn = 0
    gameStarted = true
    restartButton.style.display = "none"
    draw()
}
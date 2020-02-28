const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Body,
    Events
} = Matter

const engine = Engine.create()
engine.world.gravity.y = 0
const {
    world
} = engine

const cellsHorizontal = 10
const cellsVertical = 6
const width = window.innerWidth - 15
const height = window.innerHeight - 20
const unitLengthX = width / cellsHorizontal
const unitLengthY = height / cellsVertical

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width: width,
        height: height
    }
})

Render.run(render)
Runner.run(Runner.create(), engine)

//Define walls

const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, {
        isStatic: true
    }),
    Bodies.rectangle(width / 2, height, width, 2, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 2, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 2, height, {
        isStatic: true
    })
]

World.add(world, walls)

//Maze generation

const shuffle = (arr) => {
    let counter = arr.length

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter)
        counter--

        const temp = arr[counter]
        arr[counter] = arr[index]
        arr[index] = temp
    }
    return arr
}

const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false))
const verticalWalls = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false))
const horizontalWalls = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false))

const startRow = Math.floor(Math.random() * cellsVertical)
const startColumn = Math.floor(Math.random() * cellsHorizontal)

const stepThroughCell = (row, column) => {
    //If I have visited cell at [row, column], then return

    if (grid[row][column]) {
        console.log("Cell is already visited!")
        return
    }

    //Mark this cell as being visited
    grid[row][column] = true

    //Assemble randomly-ordered list of neighbours
    const neighbours = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ])

    for (let i = 0; i < neighbours.length; i++) {
        const neighbour = neighbours[i]
        const [nextRow, nextColumn, direction] = neighbour
        //See if that neighbour is out of bounds
        if (nextRow < 0 || nextRow >= cellsVertical ||
            nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue;
        }

        //If we have visited that neighbour, continue to next neighbour
        if (grid[nextRow][nextColumn]) {
            continue;
        }

        // Remove a wall from either horizontals or verticals
        if (direction === 'left') {
            verticalWalls[row][column - 1] = true
        } else if (direction === 'right') {
            verticalWalls[row][column] = true
        } else if (direction === 'up') {
            horizontalWalls[row - 1][column] = true
        } else if (direction === 'down') {
            horizontalWalls[row][column] = true
        }
        // console.log("nextColumn " + nextColumn)
        // console.log("nextRow " + nextRow)
        stepThroughCell(nextRow, nextColumn)
    }
    //Visit that next cell

}

stepThroughCell(startRow, startColumn)

horizontalWalls.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open)
            return

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            2, {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }
        )

        World.add(world, wall)
    })
})

verticalWalls.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open)
            return

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            2,
            unitLengthY, {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }
        )

        World.add(world, wall)
    })
})

const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * 0.7,
    unitLengthY * 0.7, {
        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: 'green'
        }
    }
)

World.add(world, goal)

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius, {
        label: 'ball',
        render: {
            fillStyle: 'blue'
        }
    }
)
World.add(world, ball)

// window.onload = init;


document.addEventListener('keydown', event => {
    const {
        x,
        y
    } = ball.velocity

    //Moving Up
    if (event.keyCode === 87 || event.keyCode === 38) {
        Body.setVelocity(ball, {
            x,
            y: y - 5
        })
    }

    //Moving Right
    if (event.keyCode === 68 || event.keyCode === 39) {
        Body.setVelocity(ball, {
            x: x + 5,
            y
        })
    }

    //Moving Down
    if (event.keyCode === 83 || event.keyCode === 40) {
        Body.setVelocity(ball, {
            x,
            y: y + 5
        })
    }

    //Moving Left
    if (event.keyCode === 65 || event.keyCode === 37) {
        Body.setVelocity(ball, {
            x: x - 5,
            y
        })
    }
})

//Winning the game

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ['ball', 'goal']

        if (
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyB.label)
        ) {
            document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y = 1
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false)
                }
            })
        }
    })
})
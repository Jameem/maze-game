const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    MouseConstraint,
    Mouse
} = Matter

const engine = Engine.create()
const {
    world
} = engine

const cells = 10
const width = 600
const height = 600
const unitLength = width / cells

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
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

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false))
const verticalWalls = Array(cells).fill(null).map(() => Array(cells - 1).fill(false))
const horizontalWalls = Array(cells - 1).fill(null).map(() => Array(cells).fill(false))

const startRow = Math.floor(Math.random() * cells)
const startColumn = Math.floor(Math.random() * cells)

const stepThroughCell = (row, column) => {
    //If I have visited cell at [row, column], then return
    // console.log("row " + row)
    // console.log("column " + column)
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
        if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
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
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength,
            2, {
                isStatic: true
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
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength / 2,
            2,
            unitLength, {
                isStatic: true
            }
        )

        World.add(world, wall)
    })
})

const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength / 2,
    unitLength * 0.7,
    unitLength * 0.7, {
        isStatic: true
    }
)

World.add(world, goal)

const ball = Bodies.circle(
    unitLength / 2,
    unitLength / 2,
    unitLength / 4
)
World.add(world, ball)
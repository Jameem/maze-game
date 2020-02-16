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

const cells = 3
const width = 600
const height = 600

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
    Bodies.rectangle(width / 2, 0, width, 40, {
        isStatic: true
    }),
    Bodies.rectangle(width / 2, height, width, 40, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 40, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 40, height, {
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
    if (grid[row][column]) {
        return
    }
    //Mark this cell as being visited
    grid[row][column] = true
    //Assemble randomly-ordered list of neighbours
    const neighbours = shuffle([
        [row - 1, column],
        [row, column + 1],
        [row + 1, column],
        [row, column - 1]
    ])
    console.log(neighbours)
    //See if that neighbour is out of bounds

    //If we have visited that neighbour, continue to next neighbour

    // Remove a wall from either horizontals or verticals

    //Visit that next cell
    console.log(grid)
}

stepThroughCell(startRow, startColumn)
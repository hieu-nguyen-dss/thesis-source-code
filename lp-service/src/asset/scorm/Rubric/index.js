class TreeNode {
  constructor(id, label, parent = null, isTopic = false, isSummary = false) {
    this.id = id
    this.label = label
    this.parent = parent
    this.children = []
    this.width = 0
    this.level = 0
    this.height = 1
    this.isTopic = isTopic
    this.isSummary = isSummary
  }

  get isLeaf() {
    return this.children.length === 0
  }

  get hasChildren() {
    return !this.isLeaf
  }
}

class Tree {
  constructor(id, value) {
    this.root = new TreeNode(id, value)
    this.leaves = []
  }

  *preOrderTraversal(node = this.root) {
    yield node
    if (node.children.length) {
      for (const child of node.children) {
        yield* this.preOrderTraversal(child)
      }
    }
  }

  calculateSize(node = this.root) {
    if (node.children.length) {
      for (const child of node.children) {
        child.level = node.level + 1
        this.calculateSize(child)
        node.height = Math.max(node.height, child.height + 1)
        node.width += child.width
      }
    } else {
      node.width = 1
      this.leaves = [...this.leaves, node]
    }
  }

  getAllLeaves(node = this.root) {
    if (node.isLeaf) {
      this.leaves = [...this.leaves, node]
    } else {
      for (const child of node.children) {
        this.getAllLeaves(child)
      }
    }
  }

  insert(parentId, id, label, isTopic, isSummary) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === parentId) {
        node.children.push(new TreeNode(id, label, node, isTopic, isSummary))
        return
      }
    }
  }

  BFS(node = this.root) {
    let visited = {}
    const queue = []
    let cur = node
    queue.push(cur)
    while (queue.length) {
      cur = queue.shift()
      visited = { ...visited, [cur.level]: [...(visited[cur.level] || []), cur] }
      for (const child of cur.children) {
        queue.push(child)
      }
    }
    delete visited[0]
    return visited
  }

  treeToJson() {
    const rs = []
    for (const node of this.preOrderTraversal()) {
      const { id, label, parent, isTopic, isSummary } = node
      rs.push({ id, label, parent: parent ? parent.id : null, isTopic, isSummary })
    }
    return rs
  }

  resetLeaves() {
    this.leaves = []
  }
}

let rubricsData = null
let current = null
let myChart = null
let myChart2 = null

async function loadRubric() {
  const get = await fetch('../data/data.json')
  const data = await get.json()
  const { rubrics } = data
  rubricsData = rubrics
  if (!rubrics || rubrics.length === 0) return
  const names = rubrics
    .map((rb) => `<button type="button" onclick='showRbDetail("${rb._id}")' >${rb.name}</button>`)
    .join('\n')
  document.getElementById('rb-list').innerHTML = names
}

async function showRbDetail(id) {
  if (!rubricsData || current === id) return
  current = id
  if (myChart) {
    myChart.destroy()
  }
  if (myChart2) {
    myChart2.destroy()
  }
  const currentRubric = rubricsData.filter((rb) => rb._id === id)[0]
  const { tree, rows } = currentRubric
  const copyTree = tree.slice()
  const root = copyTree.shift()
  const newTree = new Tree(root.id, root.label)
  let headers = { root: root.label }
  for (const node of copyTree) {
    newTree.insert(node.parent, node.id, node.label, node.isTopic, node.isSummary)
    headers = { ...headers, [node.id]: node.label }
  }
  newTree.calculateSize()
  const leaves = newTree.leaves
  const treeHeight = newTree.root.height
  const bfs = newTree.BFS()
  const { rowQuestions, rowPoints, attrQuestions, attrPoints, tableQuestions, tablePoints } =
    calcSummary(leaves, rows)

  document.getElementById('rb-name').innerHTML = currentRubric.name
  let table = `<table class="table-rb" >`
  for (const level of Object.keys(bfs)) {
    table += `<tr>`
    for (const node of bfs[level]) {
      table += `<th colspan="${node.width}" rowspan="${node.isLeaf ? treeHeight - level : 1}" >${
        node.label
      }</th>`
    }
  }

  const normalLeaves = leaves.filter((leaf) => !leaf.isTopic && !leaf.isSummary)
  let topics = {}
  for (const rowId in rows) {
    const row = rows[rowId]
    table += `<tr>`
    for (const leaf of leaves) {
      if (leaf.isTopic) {
        topics = { ...topics, [rowId]: row[leaf.id].name }
        table += `<td rowspan="2" class="topic" ><strong>${row[leaf.id].name}</strong></td>`
      } else if (leaf.isSummary) {
        table += `<td rowspan="2" >
                    <label>Questions: <strong>${rowQuestions[rowId]}</strong></label>
                    <label>Points: <strong>${rowPoints[rowId]}</strong></label>
                    <hr/>
                    <label>Questions: <strong>${Math.floor(
                      (rowQuestions[rowId] / tableQuestions) * 100
                    )}</strong> %</label>
                    <label>Points: <strong>${Math.floor(
                      (rowPoints[rowId] / tablePoints) * 100
                    )}</strong> %</label>
                  </td>`
      } else {
        table += `<td rowspan="1" >${row[leaf.id].content || ''}</td>`
      }
    }
    table += `</tr>
              <tr>`
    for (const leaf of normalLeaves) {
      table += `<td rowspan="1" >
                  <label>Questions: <strong>${row[leaf.id].nQuestions || 0}</strong></label>
                  <label>Points: <strong>${row[leaf.id].points || 0}</strong></label>
                </td>`
    }
    table += `</tr>`
  }
  table += `<tr class="sum-row">`
  for (const leaf of leaves) {
    if (leaf.isTopic) {
      table += `<td rowspan="1" ></td>`
    } else if (leaf.isSummary) {
      table += `<td rowspan="1" >
                  <label>Questions: <strong>${tableQuestions}</strong></label>
                  <label>Points: <strong>${tableQuestions}</strong></label>
                </td>`
    } else {
      table += `<td rowspan="1" >
                  <label>Questions: <strong>${attrQuestions[leaf.id]}</strong></label>
                  <label>Points: <strong>${attrPoints[leaf.id]}</strong></label>
                  <hr/>
                  <label>Questions: <strong>${Math.floor(
                    (attrQuestions[leaf.id] / tableQuestions) * 100
                  )}</strong> %</label>
                  <label>Points: <strong>${Math.floor(
                    (attrPoints[leaf.id] / tablePoints) * 100
                  )}</strong> %</label>
                </td>`
    }
  }
  table += `</tr>`
  table += `</table>`
  document.getElementById('detail').innerHTML = table
  drawChart(topics, rowPoints, rowQuestions)
}

const calcSummary = (leaves, rows) => {
  const rowQuestions = {}
  const rowPoints = {}
  const attrQuestions = {}
  const attrPoints = {}
  let tableQuestions = 0
  let tablePoints = 0
  for (const rowId in rows) {
    for (const leaf of leaves) {
      if (!leaf.isTopic && !leaf.isSummary) {
        const cellQuestions = parseInt(rows[rowId][leaf.id].nQuestions) || 0
        const cellPoints = parseFloat(rows[rowId][leaf.id].points) || 0
        rowQuestions[rowId] = (rowQuestions[rowId] || 0) + cellQuestions
        rowPoints[rowId] = (rowPoints[rowId] || 0) + cellPoints
        attrQuestions[leaf.id] = (attrQuestions[leaf.id] || 0) + cellQuestions
        attrPoints[leaf.id] = (attrPoints[leaf.id] || 0) + cellPoints
        tablePoints += cellPoints
        tableQuestions += cellQuestions
      }
    }
  }
  return {
    rowQuestions,
    rowPoints,
    attrQuestions,
    attrPoints,
    tableQuestions,
    tablePoints
  }
}

const drawChart = (topics, rowPoints, rowQuestions) => {
  const ctx = document.getElementById('myChart').getContext('2d')
  myChart = new Chart(ctx, {
    type: 'pie',
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Questions',
          font: {
            size: 14
          },
          color: 'black'
        }
      }
    },
    data: {
      labels: Object.entries(topics).map(([, name]) => name),
      datasets: [
        {
          label: 'My First Dataset',
          data: Object.entries(topics).map(([rowId]) => rowQuestions[rowId]),
          backgroundColor: Object.keys(topics).map(
            (k) =>
              `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
              )}, ${Math.floor(Math.random() * 255)})`
          ),
          hoverOffset: 4
        }
      ]
    }
  })
  const ctx2 = document.getElementById('myChart2').getContext('2d')
  myChart2 = new Chart(ctx2, {
    type: 'doughnut',
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Points',
          font: {
            size: 14
          },
          color: 'black'
        }
      }
    },
    data: {
      labels: Object.entries(topics).map(([, name]) => name),
      datasets: [
        {
          label: 'My First Dataset',
          data: Object.entries(topics).map(([rowId]) => rowPoints[rowId]),
          backgroundColor: Object.keys(topics).map(
            (k) =>
              `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
              )}, ${Math.floor(Math.random() * 255)})`
          ),
          hoverOffset: 4
        }
      ]
    }
  })
}

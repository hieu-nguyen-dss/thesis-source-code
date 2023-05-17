const { nanoid } = require('nanoid')

class TreeNode {
  constructor (id, label, parent = null, isTopic = false, isSummary = false) {
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

  get isLeaf () {
    return this.children.length === 0
  }

  get hasChildren () {
    return !this.isLeaf
  }
}

class Tree {
  constructor (id, value) {
    this.root = new TreeNode(id, value)
    this.leaves = []
  }

  * preOrderTraversal (node = this.root) {
    yield node
    if (node.children.length) {
      for (const child of node.children) {
        yield * this.preOrderTraversal(child)
      }
    }
  }

  calculateSize (node = this.root) {
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

  getAllLeaves (node = this.root) {
    if (node.isLeaf) {
      this.leaves = [...this.leaves, node]
    } else {
      for (const child of node.children) {
        this.getAllLeaves(child)
      }
    }
  }

  insert (parentId, id, label, isTopic, isSummary) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === parentId) {
        node.children.push(new TreeNode(id, label, node, isTopic, isSummary))
        return
      }
    }
  }

  treeToJson () {
    const rs = []
    for (const node of this.preOrderTraversal()) {
      const { id, label, parent, isTopic, isSummary } = node
      rs.push({ id, label, parent: parent ? parent.id : null, isTopic, isSummary })
    }
    return rs
  }

  resetLeaves () {
    this.leaves = []
  }
}

const initRubric = (name, lessons = ['topic 1', 'topic 2']) => {
  const table = new Tree('root', name)
  const levelId = nanoid(10)
  table.insert('root', nanoid(10), 'Chủ đề', true, false)
  table.insert('root', levelId, 'Mức độ nhận biết', false, false)
  table.insert('root', nanoid(10), 'Tổng', false, true)
  table.insert(levelId, nanoid(10), 'Nhận biết', false, false)
  table.insert(levelId, nanoid(10), 'Thông hiểu', false, false)
  table.insert(levelId, nanoid(10), 'Vận dụng', false, false)
  table.insert(levelId, nanoid(10), 'Vận dụng cao', false, false)
  table.calculateSize()
  let rows = {}
  for (const lesson of lessons) {
    let rowData = {}
    for (const leaf of table.leaves) {
      if (leaf.isTopic && !leaf.isSummary) {
        console.log(leaf.label)
        rowData = { ...rowData, [leaf.id]: { name: lesson } }
      } else if (leaf.isSummary && !leaf.isTopic) {
        rowData = { ...rowData, [leaf.id]: {} }
      } else {
        rowData = { ...rowData, [leaf.id]: { content: '', nQuestions: 1, points: 1 } }
      }
    }
    rows = { ...rows, [nanoid(10)]: rowData }
  }
  return {
    tree: table.treeToJson(),
    rows
  }
}

module.exports = initRubric

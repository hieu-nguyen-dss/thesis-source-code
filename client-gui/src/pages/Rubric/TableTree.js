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

  edit(label) {
    this.label = label
  }

  editIsTopic(value) {
    this.isTopic = value
  }

  editIsSummary(value) {
    this.isSummary = value
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

  * preOrderTraversal(node = this.root) {
    yield node
    if (node.children.length) {
      for (const child of node.children) {
        yield * this.preOrderTraversal(child)
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

  resetTree(node = this.root) {
    node.level = 0
    node.width = 0
    if (node.children.length) {
      for (const child of node.children) {
        this.resetTree(child)
      }
    }
  }

  BFS (node = this.root) {
    let visited = {}
    const queue = []
    let cur = node
    queue.push(cur)
    while (queue.length) {
      cur = queue.shift()
      visited = { ...visited, [cur.level]: [...visited[cur.level] || [], cur] }
      for (const child of cur.children) {
        queue.push(child)
      }
    }
    delete visited[0]
    return visited
  }

  insert (parentId, id, label, isTopic, isSummary) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === parentId) {
        node.children.push(new TreeNode(id, label, node, isTopic, isSummary))
        return true
      }
    }
    return false
  }

  remove(id) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === id) {
        if (node.parent) {
          node.parent.children = node.parent.children.filter(c => (c.id !== id))
        }
        return
      }
    }
    return false
  }

  findAndEdit(id, newLabel) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === id) {
        node.edit(newLabel)
        return
      }
    }
  }

  editIsTopic(id, value) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === id && node.isLeaf) {
        node.editIsTopic(value)
        node.editIsSummary(false)
        return true
      }
    }
    return false
  }

  editIsSummary(id, value) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === id && node.isLeaf) {
        node.editIsSummary(value)
        node.editIsTopic(false)
        return true
      }
    }
    return false
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

export default Tree

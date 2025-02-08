class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }
   buildTree(array) {
    array = [...(new Set(array))].sort((a, b) => a - b);
    let n = array.length;
  
    if (n === 0)
        return null;
  
    let mid = Math.floor((n - 1) / 2);
    let root = new Node(array[mid]);
  
    let q = [ {node : root, range : [ 0, n - 1 ]} ];
    let frontIndex = 0;
  
    while (frontIndex < q.length) {
        let front = q[frontIndex];
        let curr = front.node;
        let [s, e] = front.range;
        let index = s + Math.floor((e - s) / 2);
  
        // If left subtree exists
        if (s < index) {
            let midLeft
                = s + Math.floor((index - 1 - s) / 2);
            let left = new Node(array[midLeft]);
            curr.left = left;
            q.push({node : left, range : [ s, index - 1 ]});
        }
  
        // If right subtree exists
        if (e > index) {
            let midRight
                = index + 1
                  + Math.floor((e - index - 1) / 2);
            let right = new Node(array[midRight]);
            curr.right = right;
            q.push(
                {node : right, range : [ index + 1, e ]}
              );
        }
  
        frontIndex++;
      }
      return root;
  }
  insert(value) {
    const newNode = new Node(value);
    const { parent } = this.findNodeAndParent(value);
    if (value < parent.data) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
  }
  deleteItem(value) {
    const { currentNode, parent } = this.findNodeAndParent(value);
    // Node not found
    if (!currentNode) {
      console.log("Value not found in the tree.");
      return;
    }
    // deleting a leaf node
    if (!currentNode.left && !currentNode.right) {
      if (!parent) {
        this.root = null; // Deleting the root node
      } else if (value < parent.data) {
        parent.left = null;
      } else {
        parent.right = null;
      }
      return;
    }
    // deleting a node with a single child
    if (!currentNode.left || !currentNode.right) {
      const child = currentNode.left || currentNode.right; // The non-null child
      if (!parent) {
        this.root = child; // Deleting the root node
      } else if (value < parent.data) {
        parent.left = child;
      } else {
        parent.right = child;
      }
      return;
    }
    //deleting a node having both children
    if (currentNode.left && currentNode.right) {
      let successor = currentNode.right;
      let successorParent = null;
      while (successor !== null && successor.left !== null) {
          successorParent = successor;
          successor = successor.left;
      }
      currentNode.data = successor.data;
      successorParent.left = null;
    }
  }
  findNodeAndParent(value) {
    let currentNode = this.root;
    let parent = null;
    while(currentNode && currentNode.data !== value) {
      parent = currentNode;
      if (value < currentNode.data) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    return { currentNode, parent };
  }
  find(value) {
    const { currentNode } = this.findNodeAndParent(value)
    return currentNode;
  }
  levelOrder(callback) {
    if (!this.root) {
      throw new Error("The tree is empty.");
    }
    if (typeof callback !== 'function') {
      throw new Error("A callback is required as argument for this function.");
    }
    const queue = [this.root];
    while(queue.length > 0) {
      const currentNode = queue.shift();
      callback(currentNode);
      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }
      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }
    }
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const tree = new Tree([5, 2, 7, 10]);

tree.insert(4)
tree.insert(3)
tree.insert(6)
tree.insert(9)
tree.insert(1)
tree.insert(8)
// tree.deleteItem(5)
// console.log(tree.find(2))
prettyPrint(tree.root);

tree.levelOrder(node => console.log(node.data));
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
  
    let queue = [ {node : root, range : [ 0, n - 1 ]} ];
    let frontIndex = 0;
  
    while (frontIndex < queue.length) {
        let front = queue[frontIndex];
        let curr = front.node;
        let [start, end] = front.range;
        let index = start + Math.floor((end - start) / 2);
  
        // If left subtree exists
        if (start < index) {
            let midLeft = start + Math.floor((index - 1 - start) / 2);
            let left = new Node(array[midLeft]);
            curr.left = left;
            queue.push({node : left, range : [ start, index - 1 ]});
        }
  
        // If right subtree exists
        if (end > index) {
            let midRight = index + 1 + Math.floor((end - index - 1) / 2);
            let right = new Node(array[midRight]);
            curr.right = right;
            queue.push(
                {node : right, range : [ index + 1, end ]}
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
    this.checkForRootAndCallback(callback);
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
  inOrder(callback) {
    this.checkForRootAndCallback(callback);
    const stack = [];
    let currentNode = this.root;
    while(currentNode !== null || stack.length > 0) {
      while(currentNode !== null) {
        stack.push(currentNode);
        currentNode = currentNode.left;
      }
      currentNode = stack.pop();
      callback(currentNode);
      currentNode = currentNode.right;
    }
  } 
  preOrder(callback) {
    this.checkForRootAndCallback(callback);
    const stack = [this.root];
    while(stack.length > 0) {
      const topNode = stack.pop();
      callback(topNode);
      if (topNode.right !== null) {
        stack.push(topNode.right);
      }
      if (topNode.left !== null) {
        stack.push(topNode.left);
      }
    }
  }
  postOrder(callback) {//13426891075
    this.checkForRootAndCallback(callback);
    const stack = [this.root];
    const list = [];
    let prev = null;
    while (stack.length !== 0 ) {
      let current = stack[stack.length - 1];
      /* go down the tree in search of a leaf and if so process it
      and pop stack otherwise move down */
      if (prev === null || prev.left === current || prev.right === current) {
        if (current.left !== null) {
          stack.push(current.left);
        } else if (current.right !== null) {
          stack.push(current.right);
        } else {
          stack.pop();
          list.push(current);
        }
        /* go up the tree from left node, if the child is right
        push it onto stack otherwise process parent and pop
        stack */
      } else if (current.left === prev) {
        if (current.right !== null) {
          stack.push(current.right);
        } else {
          stack.pop();
          list.push(current);
        }
          /* go up the tree from right node and after coming back
          from right node process parent and pop stack */
      } else if (current.right === prev) {
          stack.pop();
          list.push(current);
      }
      prev = current;
    }
    list.forEach(element => callback(element));
  }
  checkForRootAndCallback(callback) {
    if (!this.root) {
      throw new Error("The tree is empty.");
    }
    if (typeof callback !== 'function') {
      throw new Error("A callback is required as argument for this function.");
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

tree.postOrder(node => console.log(node.data));
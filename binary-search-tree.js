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
    let currentNode = this.root;
    let parent = null;
    while(currentNode) {
      parent = currentNode;
      if (value < currentNode.data) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    if (value < parent.data) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
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

const tree = new Tree([5, 2, 8]);

tree.insert(4)
tree.insert(3)
prettyPrint(tree.root);
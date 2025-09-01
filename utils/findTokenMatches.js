// Aho-Corasick algorithm

class ACNode {
    parent
    children = {}
    char
    output
    link
    exitLink

    constructor(parent, char) {
        this.parent = parent
        this.char = char
    }
}

const createTrie = (words) => {
    const root = new ACNode(undefined, 'root')

    for (const word of words) {
        let node = root
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new ACNode(node, char)
            }
            node = node.children[char]
        }
        node.output = word
    }

    // add suffix links
    const queue = [root]
    while (queue.length > 0) {
        const node = queue.shift()
        for (const child of Object.values(node.children)) {
            queue.push(child)
        }

        if (node === root || node.parent === root) {
            node.link = root
            continue
        }

        let link = node.parent.link
        while (link !== root && !link.children[node.char]) {
            link = link.link
        }
        node.link = link.children[node.char] || root

        if (node.link.output) {
            node.exitLink = node.link
        } else {
            node.exitLink = node.link.exitLink
        }
    }

    return root
}

const findMatches = (text, words) => {
    // TODO: make lowercase
    // TODO: handle special characters

    const matches = new Set()
    let node = createTrie(words)
    for (const char of text) {
        if (node.children[char]) {
            node = node.children[char]
        } else {
            node = node.link.children[char] || node.link
        }

        let exitLink = node.exitLink
        while (exitLink) {
            matches.add(exitLink.output)
            exitLink = exitLink.exitLink
        }

        if (node.output) {
            matches.add(node.output)
        }
    }
    return matches
}

const logTrie = (node, depth = 0) => {
    const indent = '  '.repeat(depth)
    console.log(`${indent}${node.output ? `(${node.output})` : ''}`)
    for (const [char, child] of Object.entries(node.children)) {
        console.log(
            `${indent}  ${char} - ${child.link.parent?.char}.${child.link.char}`
        )
        logTrie(child, depth + 1)
    }
}

export { findMatches }

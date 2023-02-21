let nodes = []

if (localStorage.getItem('connectoids_nodes')){
    nodes = JSON.parse(localStorage.getItem('connectoids_nodes'))
}


$('#new-node').submit(function(evt) {
    const form = evt.target;
    const data = Object.fromEntries(new FormData(form))

    const title = data.title
    const group = data.group
    const tagsString = data.tags
    const tags = tagsString.split(',').map(tag=>tag.trim())

    const nodeObj = {title, group, tags}
    console.log(nodeObj)
    nodes.push(nodeObj)
    localStorage.setItem('connectoides_nodes', JSON.stringify(nodes))
    //evt.preventDefault()
    console.log('nodes', nodes)
});


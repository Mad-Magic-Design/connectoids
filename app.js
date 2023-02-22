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
    localStorage.setItem('connectoids_nodes', JSON.stringify(nodes))
    //evt.preventDefault()
    console.log('nodes', nodes)
});

function createGraphData(){
    /*Data for D3 Force Graph should look like:
        graphData ={
            nodes: [{
                id: '',
                group: 1,
                },
            ],
        },
        links = [{
            source: "",
            title: "",
            value: 1,
        }]
    */

    //create nodes object
    const graphNodes = nodes.map(node=> {
        return {
            id: node.title,
            group: node.group,
        }
    }
        )

    //create tags object
    const tags = {}
    
    //create object with key for each tag in every node
    /*tags = {
        'foo': ['title1', 'title2'],
        'bar': ['title1', 'title3'],
    }*/
    nodes.forEach(node=>{
        node.tags.forEach(tag =>{   
            if (tag in tags) tags[tag].push(node.title)
            else tags[tag] = [node.title]
         })
    })

    //create a link for every tag in a node by building a link for each matching tag key in the tags object
    //don't create a link to itself
    const links = []
    nodes.forEach(node =>{
        node.tags.forEach(tag=>{
            tags[tag].forEach(title =>{
                if (node.title !== title ) {
                    links.push({
                        source: node.title,
                        target: title,
                        value: 1, //can find out number of shared tags to determine value
                    })
                }
            })
        })
    })

    //combine to create data object of D3 force graph
    const graphData = {nodes:graphNodes, links}
    return graphData
}



var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));




function loadGraph(graph){

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

const graphData = createGraphData()
console.log('graph data', graphData)
loadGraph(graphData)

    



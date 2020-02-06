const window_height = window.innerHeight;
const window_width = window.innerWidth;
let forceSim;

d3.csv('timeline.csv',function(d){

	// Download the data and add random information to it.
  return {
    x  : Math.random() * window_width,
    y  : Math.random() * window_height,
    vx : Math.cos(Math.random()*2*Math.PI)*0.5,
    vy : Math.sin(Math.random()*2*Math.PI)*0.5,
    c  : '#'+(Math.random()*0xFFFFFF<<0).toString(16),
    r  : 1 }

}).then(function(data){

	// Create the canvas for drawing stuff.
	const	svg_canvas = d3.select('body')
			.append("svg")
			.attr('width', window_width)
			.attr('height', window_height);

	forceSim = d3.forceSimulation()
		.alphaDecay(0)
		.velocityDecay(0)
		.on('tick', particleDigest)
		.force('bounce', d3.forceBounce().radius(d => d.r) )
		.force('container', d3.forceSurface()
			.surfaces([
				{from: {x:0,y:0}, to: {x:0,y:window_height}},
				{from: {x:0,y:window_height}, to: {x:window_width,y:window_height}},
				{from: {x:window_width,y:window_height}, to: {x:window_width,y:0}},
				{from: {x:window_width,y:0}, to: {x:0,y:0}} ])
			.oneWay(true)
			.radius(d => d.r) );

	const newNodes = data;
	d3.select('#numparticles-val').text(newNodes.length);
	forceSim.nodes(newNodes);

	function particleDigest() {
		let particle = svg_canvas
			.selectAll('circle.particle')
			.data(forceSim.nodes().map(hardLimit));
		particle.exit().remove();
		particle.merge(
			particle.enter().append('circle')
				.classed('particle', true)
				.attr('r', d=>d.r)
				.attr('fill', d => d.c)
		)
			.attr('cx', d => d.x)
			.attr('cy', d => d.y);
	}

	function hardLimit(node) {
		node.x = Math.max(node.r, Math.min(window_width-node.r, node.x));
		node.y = Math.max(node.r, Math.min(window_height-node.r, node.y));
		return node;
	}

});

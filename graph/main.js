var initialVariableName = 'revdisp';

//var legislationExplorerBaseUrl = 'https://legislation.openfisca.fr';
var legislationExplorerBaseUrl = 'http://localhost:2030';

var apiBaseUrl = 'https://api.openfisca.fr';
// var apiBaseUrl = 'http://localhost:2000';
var variables_url = apiBaseUrl + '/api/1/variables';

var important_variables = ["revdisp", "psoc", "impo", "rev_trav", "rev_cap", "pen", "irpp", "iai", "iaidrdi", "ip_net"];

var variable_map = {};

var unimportant_variables = [
  "nombre_enfants_majeurs_celibataires_sans_enfant","age","af_nbenf",
  "autonomie_financiere","prestations_familiales_enfant_a_charge","est_enfant_dans_famille",
  "rempli_obligation_scolaire","quifam","f7ga","f7gb","f7gc","abat_spe","nbN","caseF","f6gi",
  "f6gj","f6gu","f6em","f6el","f6gp","f3vg","f3vh","f1tw","f1tv","f1tx","f3vj","f3vi","f3vf","f4bd","f4be",
  "f4ba","f4bb","f4bc","hsup","abnc_exon","nbnc_defi","nbnc_exon","mbnc_impo","abnc_defi","abnc_impo","mbnc_exon",
  "nbnc_impo","nrag_impg","arag_impg","frag_exon","nrag_defi","nrag_ajag","frag_impo","arag_defi","arag_exon",
  "nrag_exon","abic_exon","nbic_imps","abic_imps","abic_defs","nbic_exon","nbic_defs","mbic_imps","nbic_defn",
  "mbic_impv","abic_defn","abic_impn","nbic_apch","mbic_exon","nbic_impn","nacc_defn","nacc_impn","aacc_defs",
  "macc_imps","macc_impv","aacc_imps","nacc_exon","macc_exon","cncn_bene","aacc_exon","mncn_impo","cncn_defi",
  "aacc_impn","nacc_defs","aacc_defn","chomeur_longue_duree","frais_reels","f1bw","f1aw","f1dw","f1cw"
];


function main() {
  window.fetch(variables_url).then(function(response) {
    response.text().then(function(responseText) {
      var input_variables = JSON.parse(responseText);
      variable_map = compute_variable_map(input_variables);
      load_graph(variable_map, initialVariableName);
      updateIframeVariable(initialVariableName);
      document.getElementById('loading').remove();
    });
  document.getElementById('legend').setAttribute('display', 'block')
  });
}

// Page layout functions

function updateIframeVariable(name) {
  document.getElementById('info').setAttribute('src', legislationExplorerBaseUrl + '/variables/' + name);
}

// Function update graph when something is changed

function update_graph() {
    if (window.event.keyCode == 13) {
		event.cancelBubble = true;
		event.returnValue = false;
        var variable = document.getElementById('search-bar').value;
        if (variable == '') variable = 'revdisp';
        if (variable_map.hasOwnProperty(variable)) {
            load_graph(variable_map, variable);
            updateIframeVariable(variable);
        } else {
            alert(' La variable ' + variable + " n'as pas été trouvée")
        }
    }
}

// Graphical tree functions

var margin = {top: 20, right: 120, bottom: 20, left: 120},
  width = 3000 - margin.right - margin.left,
  height = 800 - margin.top - margin.bottom;

var nextId = 0, duration = 350, root = null, current_node = null;

var tree = d3.layout.tree()
  .size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("svg")
  .attr("height", height + margin.top + margin.bottom)
  .call(d3.behavior.zoom().on("zoom", redraw))
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function find_text_class(d) {
  var variable = d.variable
  if (important_variables.indexOf(variable) > -1) {
    return "important_node_text"
  }
  if (unimportant_variables.indexOf(variable) > -1) {
    return "unimportant_node_text"
  }
  return "node_text"
}

function find_node_size(d) {
  if (important_variables.indexOf(d.variable) > -1) {
    return 8
  }
  if (unimportant_variables.indexOf(d.variable) > -1) {
    return 4
  }
  return 6
}

function load_graph(variable_map, initial_variable) {
  root = compute_tree(initial_variable, 10, variable_map, important_variables, unimportant_variables)
  root.x0 = height / 2;
  root.y0 = 0;
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }
  root.children.forEach(collapse);
  update(root);
};

d3.select(self.frameElement).style("height", "800px");

function redraw() {
  svg.attr("transform",
  "translate(" + d3.event.translate + ")"
  + " scale(" + d3.event.scale + ")");
}

function update(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++nextId); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .on("click", click)
    .on("dblclick", toggle_important);

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) { return color_from_entity(d.entity)});

  nodeEnter.append("text")
    .attr("class", find_text_class)
    .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
    .attr("dy", "-1em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.label_sm; })
    .style("fill-opacity", 1e-6)

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
    .attr("r", find_node_size)
    .style("fill", function(d) { return color_from_entity(d.entity)});

  nodeUpdate.select("text")
    .style("fill-opacity", 1)
    .attr("class", find_text_class)

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6)
    .attr("class", find_text_class);

  // Update the links…
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function toggle_important(d) {
  var index = important_variables.indexOf(d.variable);
  if (index == -1) {
    important_variables.push(d.variable);
  }
  index = unimportant_variables.indexOf(d.variable);
  if (index > -1) {
    unimportant_variables.splice(index, 1);
  }
  update(d);
}

function toggle_default(d) {
  var index = important_variables.indexOf(d.variable);
  if (index > -1) {
    important_variables.splice(index, 1);
  }
  var index = unimportant_variables.indexOf(d.variable);
  if (index > -1) {
    unimportant_variables.splice(index, 1);
  }
  update(d);
}

function toggle_unimportant(d) {
  var index = unimportant_variables.indexOf(d.variable);
  if (index == -1) {
    unimportant_variables.push(d.variable);
  }
  index = important_variables.indexOf(d.variable);
  if (index > -1) {
    important_variables.splice(index, 1);
  }
  update(d);
}

function click(d) {
  // Toggle children on click.
  current_node = d;
  updateIframeVariable(d.name);
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function color_from_entity(entity) {
  switch (entity) {
    case 'foyers_fiscaux':
      return "lightsteelblue";
    case 'individus':
      return "rgb(251, 208, 208);";
    case 'menages':
      return "rgb(255, 255, 144)";
    case 'familles':
      return "rgb(173, 241, 173)";
    default :
      return "#fff"
  }
}

function toggle_important_current() {
  toggle_important(current_node)
}

function toggle_default_current() {
  toggle_default(current_node)
}

function toggle_unimportant_current() {
  toggle_unimportant(current_node)
}

// Compute variables tree


function compute_variable_map(variables) {
    var variable_map = {};
    for (var i = 0; i < variables['variables'].length; i++) {
        var children = [];
        var variable = variables['variables'][i];

        if (variable.hasOwnProperty('formula') && variable['formula'].hasOwnProperty('input_variables') &&
            variable['formula']['input_variables'] != null) {
            children = variable['formula']['input_variables']
        }

        var deprecated = true;
        if (variable.hasOwnProperty('formula') && variable['formula'].hasOwnProperty('dated_formulas')) {
            var now = new Date();
            for (j = 0; j < variable['formula']['dated_formulas'].length; j++) {
                var dated_formula = variable['formula']['dated_formulas'][j];
                if (dated_formula.hasOwnProperty('stop_instant') && dated_formula['stop_instant'] != null) {
                    var year_month_year = dated_formula['stop_instant'].split('-');
                    var stopdate = new Date(year_month_year[0], year_month_year[1], year_month_year[2]);
                    if (now < stopdate) {
                        deprecated = false
                    }
                } else {
                    deprecated = false
                }
            }
        } else {
            deprecated = false
        }
        var label = variable['name'];
        if (variable.hasOwnProperty('label')) {
            label = variable['label']
        }
        // if (variable['name'] == initialVariableName) {
        //     console.log(JSON.stringify(children));
        // }
        variable_map[variable['name']] = {
            'name': variable['name'],
            'children': children,
            'label': label,
            'deprecated': deprecated,
            'entity': variable['entity']
        };
    }
    return variable_map
}

function compute_tree(variable, max_depth, variable_map, important_variables) {
  function compute_tree_recursive(variable, depth, max_depth, visited, variable_map, important_variables) {
      var children = [];
      if (depth < max_depth && visited.indexOf(variable) == -1) {
          var new_visited = visited.slice();
          new_visited.push(variable)
          for (var i = 0 ; i < variable_map[variable]['children'].length; i++) {
              var child = variable_map[variable]['children'][i];
              if (variable_map.hasOwnProperty(child) && variable_map[child]['deprecated'] === false) {
                  children.push(compute_tree_recursive(child, depth + 1, max_depth, new_visited, variable_map, important_variables))
              }
          }
      }
      var node_name = variable;
      if (visited.hasOwnProperty(variable)) {
          node_name += ' précédent'
      }
      var label = node_name

      if (variable_map.hasOwnProperty(variable)) {
          label = variable_map[variable]['label'];
          var label_sm = label;
          if (label.length > 17) {
              label_sm = label.substring(0, 17)
              label_sm += '...'
          }
      }

      var important = false;
      if (important_variables.indexOf(variable) > -1) {
          important = true;
      }

      var newChildren = children.sort(
          function(a,b) {
              if (!(b.hasOwnProperty('variable')) || b['variable'] == undefined || b['variable'] == null) {
                  return -1
              }
              if (!(a.hasOwnProperty('variable')) || a['variable'] == undefined || a['variable'] == null) {
                  return 1
              }

              var indexA = important_variables.indexOf(a['variable']);
              if (indexA === -1) {
                      indexA = important_variables.length + unimportant_variables.indexOf(a['variable']) + 1
              }
              var indexB = important_variables.indexOf(b['variable']);
              if (indexB === -1) {
                  indexB = important_variables.length + unimportant_variables.indexOf(b['variable']) + 1
              }
              return indexA - indexB
          });

      return {
              'name': node_name,
              'label': label,
              'label_sm': label_sm,
              'variable': variable,
              'children': newChildren,
              'important': important,
              'entity': variable_map[variable]['entity']
      }
  }
  return compute_tree_recursive(variable, 0, max_depth, [], variable_map, important_variables)
}


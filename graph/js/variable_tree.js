// JAVASCRIPT

var variables_url = 'https://api.openfisca.fr/api/1/variables';

var important_variables = ["revdisp", "psoc", "impo", "rev_trav", "rev_cap", "pen", "irpp", "iai","iaidrdi","ip_net"];

var unimportant_variables =["nombre_enfants_majeurs_celibataires_sans_enfant","age","af_nbenf",
			"autonomie_financiere","prestations_familiales_enfant_a_charge","est_enfant_dans_famille",
			"rempli_obligation_scolaire","quifam","f7ga","f7gb","f7gc","abat_spe","nbN","caseF","f6gi",
			"f6gj","f6gu","f6em","f6el","f6gp","f3vg","f3vh","f1tw","f1tv","f1tx","f3vj","f3vi","f3vf","f4bd","f4be",
			"f4ba","f4bb","f4bc","hsup","abnc_exon","nbnc_defi","nbnc_exon","mbnc_impo","abnc_defi","abnc_impo","mbnc_exon",
			"nbnc_impo","nrag_impg","arag_impg","frag_exon","nrag_defi","nrag_ajag","frag_impo","arag_defi","arag_exon",
			"nrag_exon","abic_exon","nbic_imps","abic_imps","abic_defs","nbic_exon","nbic_defs","mbic_imps","nbic_defn",
			"mbic_impv","abic_defn","abic_impn","nbic_apch","mbic_exon","nbic_impn","nacc_defn","nacc_impn","aacc_defs",
			"macc_imps","macc_impv","aacc_imps","nacc_exon","macc_exon","cncn_bene","aacc_exon","mncn_impo","cncn_defi",
			"aacc_impn","nacc_defs","aacc_defn","chomeur_longue_duree","frais_reels","f1bw","f1aw","f1dw","f1cw"];

fetch(variables_url, {}).then(function(response) {
    response.text().then(function(responseText) {
        var input_variables = JSON.parse(responseText);
        var variable_map = compute_variable_map(input_variables);
        load_graph(variable_map, important_variables)
    });
}, function(error) {
    variables = {};
    console.log('Error getting ' + variables_url);
});

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
        if (variable['name'] == 'revdisp') {
            console.log(JSON.stringify(children));
        }
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

function compute_trace(variable, max_depth, variable_map, important_variables) {
    return compute_trace_recursive(variable, 0, max_depth, [], variable_map, important_variables)
}

function compute_trace_recursive(variable, depth, max_depth, visited, variable_map, important_variables) {
    var children = [];
    if (depth < max_depth && visited.indexOf(variable) == -1) {
        var new_visited = visited.slice();
        new_visited.push(variable)
        for (var i = 0 ; i < variable_map[variable]['children'].length; i++) {
            var child = variable_map[variable]['children'][i];
            if (variable_map.hasOwnProperty(child) && variable_map[child]['deprecated'] === false) {
                children.push(compute_trace_recursive(child, depth + 1, max_depth, new_visited, variable_map, important_variables))
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
            	indexA = important_variables.length
	    }
            var indexB = important_variables.indexOf(b['variable']);
            if (indexB === -1) {
            	indexB = important_variables.length
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

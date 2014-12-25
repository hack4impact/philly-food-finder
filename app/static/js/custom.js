$(document).ready(function() {

	// Hide all food resource tables initially.
	$(".admin-food-resource-type").hide(); 
	$(".admin-food-resource").hide(); 

	// Expand all resources on admin resources page.
	// Triggered when "Expand All" button pressed on admin resources page.
	$("#expand-all-resources-button").click(function() {
		showAll("-table", "expand-food-resource-type");
		showAll("-table", "expand-food-resource");
	}); 

	// Collapse all resources on admin resources page.
	// Triggered when "Collapse All" button pressed on admin resources page.
	$("#collapse-all-resources-button").click(function() {
		hideAll("-table", "expand-food-resource-type");
		hideAll("-table", "expand-food-resource");
	}); 

	// Remove a food resource without reloading page.
	removeFoodResource(); 

	// Approves a food resource without reloading page.
	$("[id$='approve']").click(function() {
		var id = $(this).attr('id');
		var dashIndex = id.indexOf("-"); 
		var foodResourceID = id.substring(0, dashIndex); 
		$.getJSON($SCRIPT_ROOT + '/_approve', {
        		id: foodResourceID
        	},
        	function(data) {
        		hide("food-resource-" + foodResourceID);
        		hide("food-resource-" + foodResourceID + "-table");
        	});  
	});	

	// If an "Expand" button is pressed, either show or hide the associated
	// food resource table.
	toggleAdminFoodResourceTypeVisibility(); 

	// If an "Expand" button is pressed, either show or hide the associated
	// food resource information. 
	toggleAdminFoodResourceVisibility(); 

    $(".start-edit").click(function() {
		CKEDITOR.disableAutoInline = true;
    	var editor1 = CKEDITOR.inline("editor1", {
    		startupFocus: true,
    		autoGrow_onStartup: true
    	});
    	$(".start-edit").hide();
    	$(".end-edit").show();
    	$("#editor1").attr("contenteditable","true");
    });

    $(".end-edit").click(function() {
    	if ( editor1 ){
    		var json_data = {
    			page_name: $(".end-edit").attr("id"),
    			edit_data: CKEDITOR.instances.editor1.getData()
    		};
    		$.post(url = $SCRIPT_ROOT + '/_edit', data = json_data);
			CKEDITOR.instances.editor1.destroy();
		}
    	$(".end-edit").hide();
    	$(".start-edit").show();
    	$("#editor1").attr("contenteditable","false");
      	});

	// Hide all time-selectors iniially.
	$("[class$='-time-picker']").hide(); 

	$('select.open-or-closed').on('change', function (e) {
	    var optionSelected = $("option:selected", this);
	    var valueSelected = this.value;
	    var parentName = optionSelected.parent().attr("name"); 
	    var endIndex = parentName.indexOf("-"); 
	    var dayOfWeek = parentName.substring(0, endIndex);
	    if (valueSelected == "open") {
	    	$("." + dayOfWeek + "-time-picker").show();
	    } else if (valueSelected == "closed") {
	    	$("." + dayOfWeek + "-time-picker").hide();
	    }
	});
});

/**
@function toggleExpansion Expand or collapse the given ID if it is currently
hidden or visible, respectively.
@param {String} idToToggle - id of the element that should be hidden or shown. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function toggleExpansion(idToToggle, classToToggleExpandSymbol) {
	if ($("#"+idToToggle).is(":hidden")) {
		show(idToToggle, classToToggleExpandSymbol);
	} else {
		hide(idToToggle, classToToggleExpandSymbol);
	}
}

/**
@function hide Collapse the element associated with the given ID.
@param {String} idToHide - id of the element that should be hidden. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function hide(idToHide, classToToggleExpandSymbol) {
	$("#"+idToHide).slideUp("medium", function() {
		$(this).hide(); 
		$(this).parent().find("." + classToToggleExpandSymbol).html("+"); 
	});
}

/**
@function show Expand the element associated with the given ID.
@param {String} idToShow - id of the element that should be shown. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function show(idToShow, classToToggleExpandSymbol) {
	$("#"+idToShow).slideDown("medium", function() {
		$(this).show();
		$(this).parent().find("." + classToToggleExpandSymbol).html("-"); 
	});
}

/**
@function hideAll Collapse all elements with the given ID suffix.
@param {String} idToHide - ID suffix of the elements that should be hidden. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function hideAll(idToHide, classToToggleExpandSymbol) {
	$("[id$='" + idToHide + "']").each(function() {
		var id = $(this).attr("id");
		hide(id, classToToggleExpandSymbol);
	}); 
}

/**
@function showAll Expand all elements with the given ID suffix.
@param {String} idToShow - ID suffix of the elements that should be shown. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function showAll(idToShow, classToToggleExpandSymbol) {
	$("[id$='" + idToShow + "']").each(function() {
		var id = $(this).attr("id");
		show(id, classToToggleExpandSymbol);
	});
}

// If an "Expand" button is pressed, either show or hide the associated
// food resource table.
function toggleAdminFoodResourceTypeVisibility() {
	$(".expand-food-resource-type").click(function() {
		var id = $(this).attr('id');  
		var prefix = "food-resource-type-expand-"; 
		var start_index = prefix.length; 
		var resource_type = id.substring(start_index); 
		var table_to_expand = resource_type + "-table"; 		
		toggleExpansion(table_to_expand, "expand-food-resource-type"); 
	})
}

// If an "Expand" button is pressed, either show or hide the associated
// food resource information.
function toggleAdminFoodResourceVisibility() {
	$(".expand-food-resource").click(function() {
		console.log("asdf!");
		var id = $(this).attr('id');  
		var prefix = "food-resource-expand-"; 
		var start_index = prefix.length; 
		var resource_id = id.substring(start_index); 
		var table_to_expand = "food-resource-" + resource_id + "-table"; 		
		toggleExpansion(table_to_expand, "expand-food-resource"); 
	}) 
}

function removeFoodResource() {
	$("[id$='remove']").click(function() {
		var id = $(this).attr('id');
		var dashIndex = id.indexOf("-"); 
		var foodResourceID = id.substring(0, dashIndex); 
		$.getJSON($SCRIPT_ROOT + '/_remove', {
        		id: foodResourceID
        	},
        	function(data) {
        		hide("food-resource-" + foodResourceID);
        		hide("food-resource-" + foodResourceID + "-table");

        		// Reduce number of food resources.
        		var currentNumResources = $("#all-num-resources").html() - 1;
        		$("#all-num-resources").html(currentNumResources); 
        	});  
	});	
}

function setTotalNumResources(num) {
	$("#all-num-resources").html(num);
}

function clearTablesOfFoodResources() {
	$(".admin-food-resource-type").remove(); 
	$(".expand-food-resource-type").html("+");
}

function getNoResourcesHtml(resourceInfoId, resourceInfoLowercaseNamePlural) {
	var html = 
	'<div id="' + resourceInfoId + '-table" class="admin-food-resource-type">' +
	'		<div class="no-resources-message">There are no ' 
			+ resourceInfoLowercaseNamePlural + ' to display.</div>' +
	'</div>';
	return html;
}

function getResourcesHtml(resourceInfoId, resourceInfoLowercaseNamePlural, resourcesArray, daysOfWeek) {
	var html = 
	'<div id="' + resourceInfoId + '-table" class="admin-food-resource-type">';

	for (var i = 0; i < resourcesArray.length; i++) {
		var resource = resourcesArray[i]; 
		html += 
		'		<div class="resource">' +

		'			<!-- Resource header -->' + 
		'			<div class= "row" id="food-resource-' + resource["id"] + '">' + 
		'				<div class="small-1 columns expand-food-resource" id="food-resource-expand-' + resource["id"] + '">' + 
		'					+' + 
		'				</div>' + 
		'				<div class="small-7 columns">' + 
			 				resource["name"] + 
		'				</div>' + 
		'				<div class="small-2 columns">' + 
		'					<a href="/edit/' + resource["id"] + '" class="food-resource-update-button">Edit</a>' + 
		'				</div>' + 
		'				<div class="small-2 columns">' + 
		'					<div id="' + resource["id"] + '-remove" class="food-resource-update-button">Remove</div>' + 
		'				</div>' + 
		'			</div>' + 
		'			<!-- Resource content -->' +  
		'			<div class="row admin-food-resource" id="food-resource-' + resource["id"] + '-table">' + 
		'				<div class="large-6 small-12 columns">' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Name:' + 
		'						</div>' + 
		'						<div class="small-9 columns">' + 
									resource["name"] + 
		'						</div>' + 
		'					</div>' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Address:' + 
		'						</div>' + 
		'						<div class="small-9 columns">' + 
									resource["address"]["line1"] +  
		'							<br>'; 

		if (resource["address"]["line2"]) {
			html += 
									resource["address"]["line2"] +  
		'							<br>'; 
		}

		html += 
									resource["address"]["city"] + ", " +
									resource["address"]["state"] +  " " +
									resource["address"]["zip_code"] +  
		'						</div>' + 
		'					</div>' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Zip Code:' + 
		'						</div>' + 
		'						<div class="small-9 columns">' + 
									resource["address"]["zip_code"] +  
		'						</div>' + 
		'					</div>' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Phone Number:' + 
		'						</div>' + 
		'						<div class="small-9 columns">' + 
									resource["phone_number"]["number"] +  
		'						</div>' + 
		'					</div>' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Website:' + 
		'						</div>' + 
		'						<div class="small-9 columns">'; 
		if (resource["url"]) {
			html += 
		'								<a href="' + resource["url"] + '">' + 
			resource["url"] + '</a>'; 
		} 
		else {
			html +=
		'								None listed.'; 
		}

		html += 
		'						</div>' + 
		'					</div>' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Description:' + 
		'						</div>' + 
		'						<div class="small-9 columns">' + 
									resource["description"] + 
		'						</div>' + 
		'					</div>' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Family and children?' + 
		'						</div>' + 
		'						<div class="small-9 columns">'; 

		if (resource["is_for_family_and_children"] == true) {
			html += 
		'								Yes'; 
		}
		else {
			html += 
		'								No'; 
		}

		html += 
		'						</div>' + 
		'					</div>' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Seniors?' + 
		'						</div>' + 
		'						<div class="small-9 columns">'; 

		if (resource["is_for_seniors"] == true) {
			html += 
		'								Yes'; 
		}
		else {
			html += 
		'								No'; 
		}
		
		html +=  
		'						</div>' + 
		'					</div>' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Wheelchair accessible?' + 
		'						</div>' + 
		'						<div class="small-9 columns">'; 

		if (resource["is_wheelchair_accessible"] == true) {
			html += 
		'								Yes'; 
		}
		else {
			html += 
		'								No';  
		}
		
		html += 
		'						</div>' + 
		'					</div>' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Accepts SNAP?' + 
		'						</div>' + 
		'						<div class="small-9 columns">'; 

		if (resource["is_accepts_snap"] == true) {
			html += 
		'								Yes';  
		}
		else {
			html += 
		'								No'; 
		}

		html += 
		'						</div>' + 
		'					</div>' + 
		'				</div>' + 
		'				<div class="large-6 small-12 columns">' + 
		'					<div class="row">' + 
		'						<div class="small-3 columns">' + 
		'							Hours:' + 
		'						</div>' + 
		'						<div class="small-9 columns">'; 

		for (var j = 0; j < daysOfWeek.length; j++) {
			var day = daysOfWeek[j];
			html += 
			'								<div class="row">' + 
			'									<div class="small-6 columns">' + 
													day["name"] + 
			'									</div>' + 
			'									<div class="small-6 columns">';  
			for (var k = 0; k < resource["timeslots"].length; k++) {
				var timeslot = resource["timeslots"][k]; 
				if (timeslot["day_of_week"] == day["index"]) {
					html += timeslot["start_time"] + " - " + timeslot["end_time"];
				}
			}
			html += 
			'									</div>' + 
			'								</div>'; 
		} 

		html += 
		'						</div>' + 
		'					</div>' + 
		'				</div>' + 
		'			</div>' + 
		'		</div>'; // resource
	}

	html += '</div>';
	return html;
}
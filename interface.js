			
			function list_onmouse_over(row_id)
			{
				var over_current_place = document.getElementById(row_id);
				if (selected_items[row_id] == null)
				{
					//alert("over a normal cell");
					over_current_place.style.backgroundColor = list_highlighted_bgcolor;
					// draw shape
					place_Polyline[row_id] = new YPolyline(wiki_data[row_id],map_shape_border_color,map_shape_border,map_shape_transparence);
					place_Polyline[row_id].hasFill = true;
					place_Polyline[row_id].fillColor = '#a0b8c8';
					map.addOverlay(place_Polyline[row_id]);
					
				}
				
			}
			function list_onmouse_out(row_id)
			{
				var out_current_place = document.getElementById(row_id);
				if (selected_items[row_id] == null)
				{
					//alert("out a normal cell");
					out_current_place.style.backgroundColor = list_defult_bgcolor;
					// clear shape
					map.removeOverlay(place_Polyline[row_id]);
					delete place_Polyline[row_id];
				}
				
			}
			function list_onmouse_click(row_id)
			{
				var click_current_place = document.getElementById(row_id);
				if (selected_items[row_id] == null)
				{
					selected_items[row_id] = wiki_data[row_id];
					//alert("click  cell");
					click_current_place.style.backgroundColor = list_selected_bgcolor;
					click_current_place.style.color = list_font_color_light;
					selected_items.count++;
					
				}
				else
				{
					delete selected_items[row_id];
					selected_items.count--;
					map.removeOverlay(place_Polyline[row_id]);
					//alert("click selected cell");
					click_current_place.style.backgroundColor = list_defult_bgcolor;
					click_current_place.style.color = list_font_color_dark;
				}
				
			}
			function addraw(tableid, wid, newoption,itemselected)
			{
			 if (document.getElementById(wid) == null)
			{
			  var tbl = document.getElementById(tableid);
			  var lastRow = tbl.rows.length;
			  // if there's no header row in the table, then iteration = lastRow + 1
			  var iteration = lastRow;
			  var row = tbl.insertRow(lastRow);
			  row.id = wid;
			  if(itemselected == true)
				{
					row.style.backgroundColor = list_selected_bgcolor;
					row.style.color = list_font_color_light;
				}
		      row.onmouseover = function() {list_onmouse_over(this.id);}; //function() {this.style.backgroundColor='#9966CC';};
		      row.onmouseout = function () {list_onmouse_out(this.id);}; // function() {this.style.backgroundColor='#ffffff';};
		      row.onclick = function () {list_onmouse_click(this.id);};
			  
			  // left cell
			  var cellLeft = row.insertCell(0);
			  cellLeft.border =1;
			  var textNode = document.createTextNode(newoption);
			  cellLeft.appendChild(textNode);
			}
			}
			function clearoptinos()
			{
				var tableRef = document.getElementById('options');
				
				//for (i=tableRef.rows.length;i>3; i--)
				var index = tableRef.rows.length;
			 	while ( index > 3 )
			 	{
					var row = tableRef.rows[index-1];
					if(selected_items[row.id] == null)
					{
			  		tableRef.deleteRow(index-1);
					}
					index --;
			 	}
			}
			function reportPosition(_e, _c)
			{
				// It is optional to specify the location of the Logger. 
				// Do so by sending a YCoordPoint to the initPos function.
				var mapCoordCenter = map.convertLatLonXY(map.getCenterLatLon());
				// Printing to the Logger
				alert(_c.Lat + " & " + _c.Lon + " !");

			}
			function showpages()
			{
				var cell = "";
				for (k=1; k<=lsit_total_pages;k++)
				{
					if (k == list_current_page)
					{
						cell = cell + " " + k + " ";
					}
					else
					{
						cell = cell + " <a href='javascript:GetDataWiki(" + k +");'>" + k + "</a> "; 
					}
				}
				var pages_con = document.getElementById("pages");
				pages_con.innerHTML = cell;
			}
			function GetDataWiki(page)
			{
				if(page == null)
				{
					page = 1;
					list_current_page = 1;
				}
				else
				{
					list_current_page = page;
				}
				var ymap = window.map.getBoundsLatLon();
				
				sendRequest("http://api.wikimapia.org/?function=box&lat_max=" + ymap.LatMax + "&lat_min=" + ymap.LatMin + "&lon_max=" +ymap.LonMax + "&lon_min=" + ymap.LonMin + "&key=" + wikipedia_api_key +"&format=xml&count=" + list_number_of_items +"&page=" + page);//+ "&pack=gzip");
				
			}
			function selizlize(places_list)
			{
				var places_list_string = '';
				for (place_key in places_list)
				{
					if (place_key != 'count')
					{
						places_list_string += place_key + ",";
						var points_list = places_list[place_key];
						for (i =0;i<points_list.length;i++)
						{
							places_list_string += points_list[i].Lat + ";" +points_list[i].Lon ;
						}
						places_list_string += "_"
					}
				}
				return places_list_string
			}
			function startMap()
			{
				// Add the ability to change between Sat, Hybrid, and Regular Maps
				map.addTypeControl(); 
				// Add the zoom control. Long specifies a Slider versus a "+" and "-" zoom control
				map.addZoomLong();
				// Add the Pan control to have North, South, East and West directional control
				map.addPanControl();
				// Specifying the Map starting location and zoom level
				map.drawZoomAndCenter('san francisco, ca', 3);
				// Add an event to report to our Logger
				YEvent.Capture(map, EventsList.MouseClick, GetDataWiki);
				YEvent.Capture(map, EventsList.changeZoom, GetDataWiki);
				
			}
			function submit_form()
			{
					if (selected_items.count<1)
					{
						alert("Sorry, no location was selected. Please select one location at least.");
					}
					else
					{
					document.f1.ta.value = selizlize(selected_items);
					document.f1.submit();
					}
			}
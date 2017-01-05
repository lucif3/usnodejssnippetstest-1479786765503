var container = document.getElementById('detailsDiv');
//container.innerHTML="";
var const_string='_team_members';
var populateHTML= function(team) {
	var teamNode=document.getElementById(team);
		teamNode.innerHTML="";
		showLoadingMessage(team);
			console.log("team is "+ team);
			var url="/myapp/teamMem?id="+team+const_string;
			xhrGet(url, function(data2){
				var receivedItems2=data2 || [];	
			 	console.log('Members : '+ receivedItems2 + "for team: "+team);
				console.log(teamNode.innerHTML);
				stopLoadingMessage(team);
				teamNode.innerHTML='<ul>';
				for (var i=0; i<receivedItems2.length; i++){
					teamNode.innerHTML+="<li class='team-mem'>"+receivedItems2[i]+"</p>";
				}
				teamNode.innerHTML+="</ul>";
				$('#'+team+'_submit').hide();
				$('#'+team+'_add').hide();
				$('#'+team+'_Update').prop('disabled',false);
			},function(err){
				console.log(err);
			});
};
var getTeamList = function(){
	xhrGet('/myapp/teamlist', function(data){
		var receivedItems=data || [];
		console.log("Teams : "+receivedItems);
		for (var i=0; i<receivedItems.length; i++){
			console.log('Team is :'+receivedItems[i]);
			showLoadingMessage(receivedItems[i]);
			populateHTML(receivedItems[i]);
		}
}, function(err){
		console.log(err);
	});
};

var editTeam = function (team) {
	$('#'+team+'_Update').prop('disabled',true);
	var url="/myapp/teamMem?id="+team+const_string;
	xhrGet(url, function(data2){
		var receivedItems2=data2 || [];	
	 	console.log('Members : '+ receivedItems2 + "for team: "+team);
		var teamNode=document.getElementById(team);
		console.log(teamNode.innerHTML);
		teamNode.innerHTML='';
		for (var i=0; i<receivedItems2.length; i++){
			teamNode.innerHTML+="<input type='checkbox' name='"+team+"_mems' checked='checked' ><input class='team-mem' type='text' value='"+receivedItems2[i]+"'></input><br>";
		}
//		$('#'+team+'_submit').hide();
	},function(err){
		console.log(err);
	});
	$('#'+team+'_submit').show();
	$('#'+team+'_add').show();
};

var addRow=function (team){
	var nodeElement= document.getElementById(team);
	nodeElement.innerHTML+="<input type='checkbox' name='"+team+"_mems' ><input class='team-mem' type='text'>";
}

var submitTeam =function(team){
	console.log($('[name='+team+'_mems]'));
	var teamDoc={};
	var members=[];
	var teamNodes=$('[name='+team+'_mems]');
	for (var j=0; j<teamNodes.length;j++){
		if($(teamNodes[j]).prop('checked')===true){
			members.push(teamNodes[j].nextSibling.value);
		}	
	}
	teamDoc.members=JSON.stringify(members);
	teamDoc.id=team+'_team_members';
	xhrPut('/myapp/putTeamList',teamDoc,function(respon){
		populateHTML(team);
		$('#'+team+'_Update').prop('disabled',true);
	},function(err){
		$('#'+team+'_Update').prop('disabled',true);
		console.log(err);
	});
};

function showLoadingMessage(team)
{
	document.getElementById('loadingImage_'+team).innerHTML = 'Loading data <img height="75" width="75" src="/images/loading.gif"></img>';
}
function stopLoadingMessage(team)
{
	document.getElementById('loadingImage_'+team).innerHTML = "";
}

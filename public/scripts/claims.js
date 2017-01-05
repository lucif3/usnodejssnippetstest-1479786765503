var receivedData="";
var teamSelected="";
var p_fail=document.getElementById('p_fail');
var p_success=document.getElementById('p_success');
function showLoadingMessage()
{
	document.getElementById('loadingImage').innerHTML = 'Working on data <img height="75" width="75" src="/images/loading.gif"></img>';
}
function stopLoadingMessage()
{
	document.getElementById('loadingImage').innerHTML = "";
}

var getTeamList= function(){
	showLoadingMessage();
	var selectList="<option selected='selected'>Select a Team</option>";
	var button=document.getElementById("getTeamData");
	var row = document.getElementById("formRoster");
	xhrGet('/myapp/teamlist', function(data){
		var receivedItems=data || [];
		console.log(receivedItems);
		for (var i=0; i<receivedItems.length ; ++i){
			selectList+="<option value='"+receivedItems[i]+"'>"+receivedItems[i]+"</option>" ;
		}
		stopLoadingMessage();
		row.innerHTML="<select id='TeamName' onchange='changeFn()'>"+selectList+"</select> <input type = 'text' id = 'datepicker'>";
		  $(function() {
			//$( "#datepicker" ).datepicker({dateFormat: 'yy-mm' });
			$("#datepicker").monthpicker();
			} );
			button.disabled=false;
		},function(err){
			console.error(err);
	});
};

var checkRoster=function () {
	showLoadingMessage();
	teamSelected=document.getElementById("TeamName").value;
	var monthSelected=document.getElementById("monthpick").value;
	monthSelected = Number(monthSelected)+1;
	if (monthSelected <= 9) { monthSelected="0"+monthSelected;}
	console.log(monthSelected);
	var yearSelected=document.getElementById("yearpick").value;
	var url_get='/myapp/getRoster?id='+teamSelected+"_"+yearSelected+monthSelected;
	console.log(url_get);
	//console.log(JSON.parse(url_get));
		//alert("this node is "+node + " and value is " + teamSelected + "Date selected is "+dateSelectedArray[0] + "2nd" + dateSelectedArray[1] + "3rd" + dateSelectedArray[2]);
		xhrGet(url_get,function(data){
			if ( data !== 'FILE NOT FOUND') {
				receivedData = data || [];	
				stopLoadingMessage();
				p_fail.innerHTML="";
				p_success.innerHTML="Roster Found for"+teamSelected+" "+yearSelected+"/"+monthSelected+", go ahead and press the Get Claims button to download";
				$('#p_button').show();
			}else {
				stopLoadingMessage();
				p_fail.innerHTML="Roster not found, please <a href='/myapp/get_docs' style='font-family:Tangerine; font-size:35px; font-weight:bold; color:blue;'>create roster</a>";
				p_success.innerHTML="";
				$('#p_button').hide();
			}
		},function(err){
			console.log(err);
		});

};
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "BAUClaims_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
var generateClaimsSheet = function () {
	showLoadingMessage();
	console.log(receivedData);
	var docOncallAr=[];
	var docNightAr=[];
	var docMorningAr=[];
	for (var i=0; i<receivedData.length; i++){
		console.log(receivedData[i]);
		var docOncallHa={};
		var docNightHa={};
		var docMorningHa={};
		if(receivedData[i].Day==='Saturday'|| receivedData[i].Day==='Sunday'){
			console.log('loop1'+receivedData[i].Day+receivedData[i].Date);
			docOncallHa.Application=teamSelected;
			docOncallHa.Date=receivedData[i].Date;
			docOncallHa.Day=receivedData[i].Day;
			docOncallHa.Claim_Type='Oncall';
			docOncallHa.Resource_Name=receivedData[i].Oncall;
			console.log(receivedData[i].Evening+ " " +receivedData[i].Morning);
			console.log(receivedData[i].Evening!=='NA'?8:16 );
			console.log(receivedData[i].Morning!=='NA'?8:16);
			console.log(receivedData[i].Evening!=='NA' && receivedData[i].Morning!=='NA' ?8:16);
			var hours_oncall=receivedData[i].Evening!=='NA' && receivedData[i].Morning!=='NA' ?8:16;	
			docOncallHa.Total_Hours=hours_oncall;
			docOncallHa.AmountPerHour=25;
			docOncallHa.Total_Amout=docOncallHa.Total_Hours*docOncallHa.AmountPerHour;
			docOncallHa.Comments="";
			docNightHa.Application=teamSelected;
			docNightHa.Date=receivedData[i].Date;
			docNightHa.Day=receivedData[i].Day;
			docNightHa.Claim_Type='Night Shift';
			docNightHa.Resource_Name=receivedData[i].Evening==='NA'?"":receivedData[i].Evening;
			docNightHa.Total_Hours=1;
			docNightHa.AmountPerHour=400;
			docNightHa.Total_Amout=receivedData[i].Evening==='NA'?0:docNightHa.Total_Hours*docNightHa.AmountPerHour;	
			docNightHa.Comments="";
			docMorningHa.Application=teamSelected;
			docMorningHa.Date=receivedData[i].Date;
			docMorningHa.Day=receivedData[i].Day;
			docMorningHa.Claim_Type='Morning Shift';
			docMorningHa.Resource_Name=receivedData[i].Morning==='NA'?"":receivedData[i].Morning;
			docMorningHa.Total_Hours=1;
			docMorningHa.AmountPerHour=400;
			docMorningHa.Total_Amout=receivedData[i].Morning==='NA'?0:docMorningHa.Total_Hours*docMorningHa.AmountPerHour;	
			docMorningHa.Comments="";
		}else if(receivedData[i].IN_Holiday==='Y' ){
			console.log('loop2'+receivedData[i].Day+receivedData[i].Date);
			if (receivedData[i].Evening !=='NA' && receivedData[i].Morning !=='NA'){
				console.log('loop3'+receivedData[i].Day+receivedData[i].Date);
				docNightHa.Application=teamSelected;
				docNightHa.Date=receivedData[i].Date;
				docNightHa.Day=receivedData[i].Day;
				docNightHa.Claim_Type='Night Shift';
				docNightHa.Resource_Name=receivedData[i].Evening;
				docNightHa.Total_Hours=1;
				docNightHa.AmountPerHour=400;
				docNightHa.Total_Amout=docNightHa.Total_Hours*docNightHa.AmountPerHour;		
				docNightHa.Comments="";
				docMorningHa.Application=teamSelected;
				docMorningHa.Date=receivedData[i].Date;
				docMorningHa.Day=receivedData[i].Day;
				docMorningHa.Claim_Type='Morning Shift';
				docMorningHa.Resource_Name=receivedData[i].Morning;
				docMorningHa.Total_Hours=1;
				docMorningHa.AmountPerHour=400;
				docMorningHa.Total_Amout=docMorningHa.Total_Hours*docMorningHa.AmountPerHour;		
				docMorningHa.Comments="";
				docOncallHa.Application=teamSelected;
				docOncallHa.Date=receivedData[i].Date;
				docOncallHa.Day=receivedData[i].Day;
				docOncallHa.Claim_Type='Oncall';
				docOncallHa.Resource_Name=receivedData[i].Oncall;
				docOncallHa.Total_Hours=8;
				docOncallHa.AmountPerHour=25;
				docOncallHa.Total_Amout=docOncallHa.Total_Hours*docOncallHa.AmountPerHour;
				docOncallHa.Comments="IN Holiday";
			} else if (receivedData[i].Evening !=='NA' && receivedData[i].Morning ==='NA'){
				console.log('loop4'+receivedData[i].Day+receivedData[i].Date);
				docNightHa.Application=teamSelected;
				docNightHa.Date=receivedData[i].Date;
				docNightHa.Day=receivedData[i].Day;
				docNightHa.Claim_Type='Night Shift';
				docNightHa.Resource_Name=receivedData[i].Evening;
				docNightHa.Total_Hours=1;
				docNightHa.AmountPerHour=400;
				docNightHa.Total_Amout=docNightHa.Total_Hours*docNightHa.AmountPerHour;		
				docNightHa.Comments="";
				docMorningHa.Application=teamSelected;
				docMorningHa.Date=receivedData[i].Date;
				docMorningHa.Day=receivedData[i].Day;
				docMorningHa.Claim_Type='Morning Shift';
				docMorningHa.Resource_Name="";
				docMorningHa.Total_Hours=1;
				docMorningHa.AmountPerHour=400;
				docMorningHa.Total_Amout=0;					
				docMorningHa.Comments="";
				docOncallHa.Application=teamSelected;
				docOncallHa.Date=receivedData[i].Date;
				docOncallHa.Day=receivedData[i].Day;
				docOncallHa.Claim_Type='Oncall';
				docOncallHa.Resource_Name=receivedData[i].Oncall;
				docOncallHa.Total_Hours=16;
				docOncallHa.AmountPerHour=25;
				docOncallHa.Total_Amout=docOncallHa.Total_Hours*docOncallHa.AmountPerHour;
				docOncallHa.Comments="IN Holiday";
			} else if(receivedData[i].Evening ==='NA' && receivedData[i].Morning !=='NA'){
				console.log('loop5'+receivedData[i].Day+receivedData[i].Date);
				docNightHa.Application=teamSelected;
				docNightHa.Date=receivedData[i].Date;
				docNightHa.Day=receivedData[i].Day;
				docNightHa.Claim_Type='Night Shift';
				docNightHa.Resource_Name="";
				docNightHa.Total_Hours=1;
				docNightHa.AmountPerHour=400;
				docNightHa.Total_Amout=0;		
				docNightHa.Comments="";
				docMorningHa.Application=teamSelected;
				docMorningHa.Date=receivedData[i].Date;
				docMorningHa.Day=receivedData[i].Day;
				docMorningHa.Claim_Type='Morning Shift';
				docMorningHa.Resource_Name=receivedData[i].Morning;
				docMorningHa.Total_Hours=1;
				docMorningHa.AmountPerHour=400;
				docMorningHa.Total_Amout=docMorningHa.Total_Hours*docMorningHa.AmountPerHour;
				docMorningHa.Comments="";
				docOncallHa.Application=teamSelected;
				docOncallHa.Date=receivedData[i].Date;
				docOncallHa.Day=receivedData[i].Day;
				docOncallHa.Claim_Type='Oncall';
				docOncallHa.Resource_Name=receivedData[i].Oncall;
				docOncallHa.Total_Hours=16;
				docOncallHa.AmountPerHour=25;
				docOncallHa.Total_Amout=docOncallHa.Total_Hours*docOncallHa.AmountPerHour;	
				docOncallHa.Comments="IN Holiday";
			}
		}else {
			console.log('loop5'+receivedData[i].Day+receivedData[i].Date);
				docNightHa.Application=teamSelected;
				docNightHa.Date=receivedData[i].Date;
				docNightHa.Day=receivedData[i].Day;
				docNightHa.Claim_Type='Night Shift';
				docNightHa.Resource_Name=receivedData[i].Evening==='NA'?'':receivedData[i].Evening;
				docNightHa.Total_Hours=1;
				docNightHa.AmountPerHour=400;
				docNightHa.Total_Amout=receivedData[i].Evening==='NA'?0:docNightHa.Total_Hours*docNightHa.AmountPerHour;		
				docNightHa.Comments="";
				docMorningHa.Application=teamSelected;
				docMorningHa.Date=receivedData[i].Date;
				docMorningHa.Day=receivedData[i].Day;
				docMorningHa.Claim_Type='Morning Shift';
				docMorningHa.Resource_Name=receivedData[i].Morning==='NA'?'':receivedData[i].Morning;
				docMorningHa.Total_Hours=1;
				docMorningHa.AmountPerHour=400;
				docMorningHa.Total_Amout=receivedData[i].Morning==='NA'?0:docMorningHa.Total_Hours*docMorningHa.AmountPerHour;	
				docMorningHa.Comments="";
				docOncallHa.Application=teamSelected;
				docOncallHa.Date=receivedData[i].Date;
				docOncallHa.Day=receivedData[i].Day;
				docOncallHa.Claim_Type='Oncall';
				docOncallHa.Resource_Name=receivedData[i].Oncall;
				docOncallHa.Total_Hours=8;
				docOncallHa.AmountPerHour=25;
				docOncallHa.Total_Amout=docOncallHa.Total_Hours*docOncallHa.AmountPerHour;
				docOncallHa.Comments="";
		}
		console.log(docOncallHa);
		console.log(docNightHa);
		console.log(docMorningHa);
		docOncallAr.push(docOncallHa);
		docNightAr.push(docNightHa);
		docMorningAr.push(docMorningHa);
	}
	console.log(docOncallAr);
	console.log(docNightAr);
	console.log(docMorningAr);
	var masterDocAr=[];
	for (var k=0; k<docOncallAr.length;k++){
		masterDocAr.push(docOncallAr[k]);
	}
	for (var l=0;l<docNightAr.length; l++){
		masterDocAr.push(docNightAr[l]);
	}
	for (var m=0; m<docMorningAr.length;m++){
		masterDocAr.push(docMorningAr[m]);
	}
	console.log(masterDocAr);
	stopLoadingMessage();
	JSONToCSVConvertor(masterDocAr,teamSelected, true);
};

function writemsg(fmsg,smsg){
	document.getElementById('p_fail').innerHTML=fmsg;
	document.getElementById('p_success').innerHTML=smsg;
}
function showLoadingMessage(side,message)
{
	document.getElementById('loadingImage_'+side).innerHTML =message+' <img height="50" width="50" src="/images/loading.gif"></img>';
}
function stopLoadingMessage(side)
{
	document.getElementById('loadingImage_'+side).innerHTML = "";
}
function refreshLeft(){
	showLoadingMessage('left',"Loading data...");
	var node=document.getElementById('attachmentDoc');
	var nodeRow="";
	xhrGet('/myapp/repoAttach',function(result){
		console.log(result);
		if (result==='NO FILES' || result==='DBERR' || result.length===0){
			stopLoadingMessage('left');
			writemsg('No files found.',"");
		}else {
			for (var i=0; i<result.length; i++){
				nodeRow+="<tr><td class='content'><a href='/myapp/repoGetAttach?id="+result[i]+"' target='_blank'>"+result[i]+"</td><td><span class='deleteBtn' onclick='deleteItem(this)' title='delete me'></span></td></tr>";
			}
			stopLoadingMessage('left');
			node.innerHTML=nodeRow;
		}
	},function(err){
		console.log(err);
	});
}
function deleteItem(node){
	showLoadingMessage('left',"Deleting file ...");
	console.log(node);
	console.log(node.parentElement.previousElementSibling.firstChild.innerHTML);
	var docId=node.parentElement.previousElementSibling.firstChild.innerHTML;
	var parentNode=node.parentElement.parentElement;
	console.log(parentNode);

	var url="/myapp/delRoster?id="+docId;
	xhrDelete(url, function(data){
			if (data === 'SUCCESS' ) {
				writemsg('','Document '+docId+' Deleted'); 
				$(parentNode).remove();
				stopLoadingMessage('left');
			} else {
				stopLoadingMessage('left');
				writemsg('Failed to delete '+docId,'');
			}
	});		
}
function uploadFile(node){
		$('#upload_file').prop('disabled',true);
		$('[type=submit]').prop('disabled',true);
	showLoadingMessage('right',"Uploading file...");

	var file=node.previousElementSibling.files[0];
	if (!file){alert('Please select a file and then click upload'); return;}
	console.log(file);
	var id=file.name;
	var form = new FormData() ;
	form.append("file",file);
	xhrAttach('/myapp/repoAttach?id='+id,form,function(doc){
		console.log('Document id: '+doc.id);
		console.log('Attachment'+doc);
		stopLoadingMessage('right');
		writemsg("","Successfully Uploaded doc:"+id);
		$('#upload_file').prop('disabled',false);
		$('[type=submit]').prop('disabled',false);
		refreshLeft();
	},function(err){
		$('#upload_file').prop('disabled',false);
		$('[type=submit]').prop('disabled',false);
		stopLoadingMessage('right');
		writemsg("Failed to upload file"+id, "");
		console.log(err);
	});
	
}

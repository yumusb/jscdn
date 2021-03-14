layui.use(['upload', 'form', 'element', 'layer'], function() {
	var upload = layui.upload;
	var form = layui.form;
	var element = layui.element;
	var layer = layui.layer;

	var uploadInst = upload.render({
		elem: '#upimg' //绑定元素
		//选择的时候触发
		,
		choose: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
			obj.preview(function(index, file, result) {
				layer.load();
				$.ajax({
					url: uploadurl,
					data: result.split("base64,")[1],
					type: 'post',
					processData: false,
					contentType: false,
					dataType: 'json',
					success: function(data) {
						handleres(data);
					},
					error: function(xOptions, textStatus) {
						return;
					}

				});
			});
		}
	});
});

function handleres(res, index) {
	layui.use('layer', function() {
		var layer = layui.layer;
		if (res.code != 'success') {
			layer.open({
				title: '温馨提示',
				content: res.msg
			});
			layer.closeAll('loading');
		} else {
			layer.closeAll('loading');
			$("#img-thumb a").attr('href', res.url);
			$("#img-thumb img").attr('src', res.url);
			$("#url").val(res.url);
			$("#html").val("<img src = '" + res.url + "' />");
			$("#markdown").val("![](" + res.url + ")");
			$("#bbcode").val("[img]" + res.url + "[/img]");
			$("#imgshow").show();
		}
	});

}

//复制链接
//复制链接

function copyurl(info) {
	var copy = new clipBoard(document.getElementById('links'), {
		beforeCopy: function() {
			info = $("#" + info).val();
		},
		copy: function() {
			return info;
		},
		afterCopy: function() {

		}
	});
	layui.use('layer', function() {
		var layer = layui.layer;
		layer.msg('链接已复制！', {
			time: 2000,
			icon: 1
		})
	});
}


//显示图片链接

function showlink(url) {
	layer.open({
		type: 1,
		title: false,
		content: $('#imglink'),
		area: ['680px', '500px']
	});
	$("#url").val(url);
	$("#html").val("<img src = '" + url + "' />");
	$("#markdown").val("![](" + url + ")");
	$("#bbcode").val("[img]" + url + "[/img]");
	$("#imglink").show();
}


document.addEventListener('paste', function(event) {
	var isChrome = false;
	if (event.clipboardData || event.originalEvent) {
		var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
		if (clipboardData.items) {
			// for chrome
			var items = clipboardData.items,
				len = items.length,
				blob = null;
			isChrome = true;

			event.preventDefault();

			let images = [];
			for (var i = 0; i < len; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					blob = items[i].getAsFile();
					images.push(blob);
				}
			}
			if (images.length > 0) {
				layer.confirm('是否上传粘贴板文件？', function(index) {
					layer.load();
					console.log(images[0]);
					var fileReader = new FileReader();
					fileReader.readAsDataURL(images[0]);
					fileReader.onload = function(event) {
						// 文件里的文本会在这里被打印出来
						//console.log(event);
						var filebase = event.target.result.split("base64,")[1];
						$.ajax({
							url: uploadurl,
							data: filebase,
							type: 'post',
							processData: false,
							contentType: false,
							dataType: 'json',
							success: function(data) {
								handleres(data);
							},
							error: function(xOptions, textStatus) {
								return;
							}

						});
					};

					layer.close(index);
				});
			}
			if (blob !== null) {
				let reader = new FileReader();
				reader.onload = function(event) {
					let base64_str = event.target.result;
				}

			}
		} else {
			//for firefox
		}
	} else {}
});

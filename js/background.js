
/*
 Copyright (c) 2018, Hamed MP
@thehamedmp

 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the
 names of its contributors may be used to endorse or promote products
 derived from this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL EVAN JEHU BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


chrome.commands.onCommand.addListener(function(command) {
	
	console.log('Command:', command);
});

function updateBadge(){
  chrome.tabs.query({},function(tabs){     
    chrome.browserAction.setBadgeText({text: String(tabs.length)});
 });
}

chrome.tabs.onCreated.addListener(updateBadge);
chrome.tabs.onRemoved.addListener(updateBadge);
// chrome.tabs.onCreated.addListener(updateBadge);
// chrome.tabs.onCreated.addListener(updateBadge);
updateBadge();

//测试右键菜单
var parent00 = chrome.contextMenus.create({"title": "搜索"});
var child01 = chrome.contextMenus.create({
    title: "新标签打开百度",
    "parentId":parent00,
    onclick: function(){
    	chrome.tabs.create({url : 'http://baidu.com'}, function(tab) {
  		});
    }
});
var child02 = chrome.contextMenus.create({
    title: "新标签打开搜狗",
    "parentId":parent00,
    onclick: function(){
    	chrome.tabs.create({url : 'http://sogou.com'}, function(tab) { 
//  	chrome.tabs.executeScript(tab.id, {file: 'src/contentScript2'});
		});
    }
});
var child03 = chrome.contextMenus.create({
//	id:2,
	"parentId":parent00,
    title: "新标签打开谷歌",
    onclick: function(){
    	chrome.tabs.create({url : 'https://google.com'}, function(tab) {
//  	chrome.tabs.executeScript(tab.id, {file: 'src/contentScript2'});
		});
    }
});

chrome.contextMenus.create({
    title: '使用度娘搜索：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function(params)
    {
        // 注意不能使用location.href，因为location是属于background的window对象
        chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
    }
});

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

// Create one test item for each context type.
var contexts = ["page","selection","link","editable","image","video",
                "audio"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Test '" + context + "' menu item";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                       "onclick": genericOnClick});
  console.log("'" + context + "' item:" + id);
}

// Create some radio items.
function radioOnClick(info, tab) {
  console.log("radio item " + info.menuItemId +
              " was clicked (previous checked state was "  +
              info.wasChecked + ")");
}
var radio1 = chrome.contextMenus.create({"title": "Radio 1", "type": "radio",
                                         "onclick":radioOnClick});
var radio2 = chrome.contextMenus.create({"title": "Radio 2", "type": "radio",
                                         "onclick":radioOnClick});

// Create some checkbox items.
function checkboxOnClick(info, tab) {
  console.log(JSON.stringify(info));
  console.log("checkbox item " + info.menuItemId +
              " was clicked, state is now: " + info.checked +
              "(previous state was " + info.wasChecked + ")");

}
var checkbox1 = chrome.contextMenus.create(
  {"title": "Checkbox1", "type": "checkbox", "onclick":checkboxOnClick});
var checkbox2 = chrome.contextMenus.create(
  {"title": "Checkbox2", "type": "checkbox", "onclick":checkboxOnClick});
console.log("checkbox1:" + checkbox1 + " checkbox2:" + checkbox2);

// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    console.log('inputChanged: ' + text);
    if(!text) return;
    if(text == '微博') {
        suggest([
            {content: '新浪' + text, description: '新浪' + text},
            {content: '腾讯' + text, description: '腾讯' + text},
            {content: '搜狐' + text, description: '搜狐' + text},
        ]);
    }
    else {
        suggest([
            {content: '百度搜索 ' + text, description: '百度搜索 ' + text},
            {content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text},
        ]);
    }
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
    console.log('inputEntered: ' + text);
    if(!text) return;
    var href = '';
    if(text.endsWith('--')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
    else if(text.startsWith('百度搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
    else if(text.startsWith('搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
    else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
    openUrlCurrentTab(href);
});
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}

// 打开某个链接（新页签）
function openUrlCurrentTab(url)
{
    getCurrentTabId(tabId => {
    	chrome.tabs.create({url: url});//新页签打开
        //chrome.tabs.update(tabId, {url: url});//当前页签打开
    })
}




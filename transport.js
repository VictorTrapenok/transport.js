/*
 * transport.js
 * 
 * Copyright (c) 2013, Трапенок Виктор (Trapenok Victor). All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */

/**
 * Представляет функционал для взаимодействия с сервером.
 * @category Функционал CMS Machaon
 */
 
/**
 * Для передачи танных с помощю AJAX
 */
var transport = function()
{
 this.url='';
 this.message='';
 this.request = false;
 this.ContentType=''; // text/xml 
 
 /**
  * Позволяет автоматически заменять все вхожденя подстроки _InsertMesageID_ в ответ сервера
  * на один уникальный в пределах странице идентификатор
  */
 this.InsertMesageID=true

 /**
  * Если this.InsertMesageID==true то при генерации нового идентификатора функцией GetNweID() ей в качестве параметра будет передано это значение
  * на один уникальный в пределах странице идентификатор
  */
 this.InsertMesageIDObject=undefined

 //Дополнительный параметр передаваемый функции (this.get) при возвращении ответа
 this.callBackParamArray = Array();

 this.TargetResponse=''; // id DOM элемента куда будет вставлен ответ

 this.send = function(url,message,callBack)
 { 
   try {
     this.request = new XMLHttpRequest();
   } catch (trymicrosoft) {
     try {
       this.request = new ActiveXObject("Msxml2.XMLHTTP");
     } catch (othermicrosoft) {
       try {
         this.request = new ActiveXObject("Microsoft.XMLHTTP");
       } catch (failed) {
         this.request = false;
       }
     }
   }

   this.url=url;
   if(message!==undefined){this.message=message;}else{this.message="";}
   this.request.open("post", url, true);
   var thisObj=this;

   this.request.onreadystatechange = function()
   {
		if (thisObj.request.readyState == 4 && thisObj.request.status == 200)
		{
			 var text=thisObj.request.responseText
			 
			   //  text = text.replace(/<!--\s?noscript\s?-->(.*\n*)*.*?<!--\s?\/noscript\s?-->/img, "")
			 if(thisObj.InsertMesageID)
			 {
				 var newID=GetNewID(thisObj.InsertMesageIDObject);
				 text = text.replace(/_InsertMesageID_/g, newID);
			 } 
		
			 if(callBack)
			 {
			 	callBack(text,thisObj.callBackParamArray);
			 }
			 else
			 {
			 	thisObj.get(text,thisObj.callBackParamArray);
			 }
		}
   };

   if(this.ContentType=='')
   {
       if(message!='')
       {
           this.ContentType='text/xml';
       }
       else
       {
           this.ContentType='application/x-www-form-urlencoded';
       }
   }
   this.request.setRequestHeader("Content-type", this.ContentType);
   this.request.send(message); // Именно здесь отправляются данные

 }

 this.get = function(response)
 { 
     setValueByID(this.TargetResponse,response); 
 }
}

/**
 * Установит содержимое элементу (value и innerHTML) по id
 */
function setValueByID(id,value)
{
   if(id===undefined){return 0;}
   
   if(id.value)
   {
   		id.value=value;
   }
   if(id.innerHTML)
   {
   		id.innerHTML=value;
   }
    var node = document.getElementById(id);
    if (node)
    {
        node.value=value;
        node.innerHTML=value;
    }
    else
    {
    	console.error("setValueByID: Объект '"+id+"' не найден ("+value+")");
    }
}

var _ConfByArray_curent_id=0;
var _ConfByArray_manager = {}
/**
 *  Возвращает объект соответствующий id
 *  @see GetNewID(obj)
 */
function GetConfByID(id)
{
    if(!_ConfByArray_manager[id]){console.error("GetConfByID: запрос не существующего индекса."+id);}
 return _ConfByArray_manager[id];
}

/** Выдаёт уникальные идентификаторы в пределах страницы
 *  И сохраняет переданный объект в массив для того чтоб к нему можно было обратится по id
 *  @see GetConfByID(id)
 */
function GetNewID(obj)
{
      _ConfByArray_curent_id++;
      _ConfByArray_manager[_ConfByArray_curent_id]=obj;
 return _ConfByArray_curent_id;
}


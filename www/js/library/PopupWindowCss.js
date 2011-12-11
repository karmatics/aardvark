(function (cssArray) {
    var cssNode = document.createElement("style");
    cssNode.setAttribute("type", "text/css");
    cssNode.setAttribute("media", "screen");
    
    var isIE = (document.all != null);
    
    if (isIE) {
     /* for (var i=0;i<cssArray.length;i+=2) {
        var a = cssArray[i].split(",");
        for (var j=0; j<a.length; j++) {
          cssNode.addRule(a[j], cssArray[i+1]);
        }
      }*/
    }
    else {
      for (var i=0; i<cssArray.length; i+=2)
        cssNode.appendChild(document.createTextNode(cssArray[i] + " {" + cssArray[i+1] + "}"));
    }
    document.getElementsByTagName("head")[0].appendChild(cssNode);
  })([
    "table.rjbwindow",
    "border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; position: absolute; z-index: 500; width: auto;",
    "table.rjbwindow div,table.rjbwindow table, table.rjbwindow tr, table.rjbwindow td, table.rjbwindow tr",
    "color: #000; background: transparent; border: 0; font-family: arial; font-weight: normal; font-size: 13px; font-style: normal; text-align: left; text-decoration: none; text-indent: 0; vertical-align: top; padding: 0; margin: 0; line-height: 1em;",
    "table.rjbwindow select",
    "border: 1px solid black; margin: 1px; padding: 0px; color:#050; font: bold 84% 'trebuchet ms',helvetica,sans-serif; background-color: #fff;",
    "table.rjbwindow input.text",
    "border: 1px solid black; margin: 1px; padding: 3px; color:#333; font: bold 11px helvetica,sans-serif; background-color: #fff;",
    "table.rjbwindow input.button",
    "border: 1px solid #fff; margin: 1px; padding: 2px 3px; color:#050; font: bold 11px helvetica,sans-serif; background-color: #ccc; -webkit-border-radius: 7px; -moz-border-radius: 7px; -webkit-box-shadow: 1px 1px 2px rgba(0,0,0,.5); -moz-box-shadow: 1px 1px 2px rgba(0,0,0,.5);",
    "table.rjbwindow input.button:hover",
    "background-color:#ffc; color:#000;",
    "table.rjbwindow input.button:active",
    "color:#fff; margin: 2px 0px 0px 2px; background-color: #555; -webkit-box-shadow: 0 0 2px rgba(0,0,0,.5); -moz-box-shadow: 0 0 2px rgba(0,0,0,.5);",
    "table.rjbwindow textarea",
    "background-color: #eee; border: 1px solid black; margin: 0; padding: 1px 2px; color:#000; font-family: courier new, helvetica,sans-serif; font-weight: bold;",
    "table.rjbwindow tr",
    "margin: 0; padding: 0;",
    "table.rjbwindow td",
    "margin: 0; padding: 0; vertical-align: middle;",
    "table.rjbwindow td.dragbar",
    "height: 6px; cursor: move; font-size: 4px; background-color: #04a; border-width: 1px 0 1px 1px; border-color: #66c; border-bottom-color: #000; border-style: solid;",
    "table.rjbwindow div.rjbtitle",
    "margin: -4px 0 -4px -3px; float: left; padding: 2px 13px 2px 8px; background-color: #04a; -moz-border-radius: 4px; -webkit-border-radius: 4px; border-width: 1px 0 1px 1px; border-color: #66c; border-bottom-color: #000; border-style: solid; font-size: 12px; font-weight: bold; color: white;",
    "table.rjbwindow td.hilite, table.rjbwindow td.hilite div.rjbtitle",
    "background-color: #07c; border-color: #88d; border-bottom-color: #000;",
    "table.rjbwindow td.killbox",
    "height: 10px; width: 3px;",
    "table.rjbwindow div.killbox",
    "width: 19px; height: 20px; margin: 0 0 -10px -11px; position: relative; top: -5px; left: 0px; cursor: pointer; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAAXNSR0IArs4c6QAABE1JREFUOMt1lE1sVFUcxc+972Pee503Mx2gM0Naik4rKVgoGAKigiFo1WpM/AhG0MSIUWEhSuJC4saEhSsXqISgJEJEF5oaMARXakBIDVoMtEztUCi0M8NMp/PR927f93VRbRiQf/Lb/G/OWdyc/yH4n9n+6gV64a/rLdMVb7VleUnL8khEh08ozy7rbLq8fdvSyo7Xe/jtOnL7omPZ8XSl6u+0bakvGtUXN4UTshIS4TgGqtUiM2amrqnq7NGODuXouTPbpu5qlljcv8k0hU8Sqc4VW19MSevWhkhzszD/PlUOcOY3AydODNqFQvbXZBK7RzNvX77DLNn6wwbDUA5v2NDT+cq2KNU0irtNvR7gwMHxYHjoVCaV8vtGM3uuAYAAAPct/7G9PIUjK1c9sOKF52JUEAhEkaBU4jBNNBAOE9TrQFdXjFwZiy6cnBzs7u7u6c/nBhz61q5LtFy2dy5c1LJi00admCbH8i6K7vs5RBHIFzjyBY5iMUAqRbBmtYP2JQS1GscTvfeSkNL5yPi4uxUA6Nmz1xbalvR0a2uHPD0NqBpBPO5hQbyGB9cTaBpQLAZIpwX0rHKgqQyJBEG1FiAz4kDXOyXLkt/oWt6ricWStVKU4m3hsIx8geNm0UMQiHj2GQ0ti6p4qjeG4QzF+nVzRvm8jt17qhgeLsC2fQAy8fxkl2FcXCsGvrdUDinq9DQABACAY984ME0JL7+kIZmsIpmc+/iJyQje3FXDSCbfmC+6IFSrmVtEw3BoU5jQm8XGDH5x2EFHWsGjG9n87tMD7A6juUgIYKyepqpGuON4vFIxcStbNovoWRk0iHa8pqFtSQoAbYDDhyyDUEl0c57HAsDAf/Q9qePddwTEYnUUCjF81x+Zu450HYcORJFMtQJEnocHZV9VXZ8mWsxh8BwjhIOA4+GHkvhwr4QF8Romc814730HH+ydwP7PdLBZDR3pOr48qEPXU6CEArC4JF5hzMxVaDKRm5DE8d+VUJWDxDB2FcjlKQqFGD7a5+D8HwwgEez/3Maxb0WwWQ2XhgIwBoDEIJAhX5ayJde1/xSuZM8E8Xiczs7Kjytqt+w4As6f9zE0zHH6rA9REv+FYPCCj3JZwFdHXXAQRPQsN2e+r/n+6UzgO4cEAFDVyrjrGOtkWWmLRNOCbVMUChxKCA1IEjB2NYAgAAIt8XLpiEH4TyOmkfslFAr1CwBgmoYVjdSyjJXWeB5rjjUvFnU9TBSVQlFJI4oPSgaC3MTXBsGpv2fqoyOKonzMGKvP9wtjbEKWbmYde/SeSmVMDoKypCoWlSQCSbS465a45w74N66ftKdKJ4sEP4/O1MeyTU1N+xhjV+/os7a2NlIul5d5Pp6ntGWzILQnAh5RPTeAHAIksWbx4EaVsVzV9/1BWZYPWpZ1465NCwDxeJyaptnuuu5jnPNVnHMKAIQQjxByUZKkc4IgXGaMebfq/gFYngomeLOYlwAAAABJRU5ErkJggg==);",
    "table.rjbwindow div.killbox:hover",
    "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAABCdJREFUOMuFVE1oVFcYPd+d9+78JTMjTmL+4xCSdGJMTSDaSkuqUhAVTdG0CGrdtAsh6kJKwUWl1oVIN20qlP4sTDetpelCxAi6CEKtGONfmyhjI3GSSZNMMnkz897MvHnv62KMOgbpgbO5cA7n3vPdj5gZL2O8t1ckLl8uN+fm2k3DqLAMgzgQsFiIiHPdutGKI0cWQjt3LhPSy2YjdXUNVjx+yGkY20tXrKhy1dZKh9eLnKZBe/JEn00mH6dLSvplONy/5fr1uSIxMz/jTZ+v6zbRrX/D4Wyur8+2799njsWYp6eZp6bYHhlh4/RpHqury/yuKIO/rV4dflH/LNlwILDRo2k/1vf0NLoPHxbk9eJV4EQC0ydP2kNDQ2O5urrt+x89egwAAgBuh0L1iqb11W/d2uTZv19QLgeYJjA5WcypKYAIZBio7O0VGzs6wlo0+v1nnZ2lACAmjh8X5szMoYry8jXubdsIqRTQ3l6gqj43isWA2lqgrQ1obATm51HT00NhKd/ORyIfAICYHxgIOg1jx4r16yXNzQFuN+DzAYoCdHUBXm8hUTgMtLYCREBVFTgeh3XnDtb4fKpL1z96r7XVo2RjsbagotSqJSVANFpIYdtAdzfgdAK7dwN37wKdnQAROJVCdt8+5AcHwZkM3ADVAOEbmtbpOKiqm8scjm5fMCiQTAKaBgwPFxKsXVu4anV1wUjTYHR3I3/pEpDPF2YLwCxAQ8wxJZdMCofHIzA5WVzZmTNAc3Mh0VPkTp2CdfXqsnadABbT6QbBXi/ns1nGxASKuGsX0NFRJJLHjkHZsAHi6RgsMQuAnU7CpUBg+yiQs4jYXmJvL7NpMjMzGwbbFy7wEuyZGTbb2zkHcA7gLMA/AHpLMPgTfmltDV0mSlhCsC0E2wcOPDdKp5n37GFbUZjPnmW27cL59DTbjY1sC8GLRPYnLtecz+P5WozX10cfulw34h4Pk98PevCg0GgmAxw9Cly5AiotBU6cAM6dA5iBmzdBug7y+zEspfWX2z1rmOYtYmYcrKz8cMfCwje7qqq8qsMBNDQATU3AxYvFLy0lsHcvcP48oOuYzmT4y3h8oV/K4UQ2e5iYGTWVlYGNmvbzx1K+09XQIFUh8H+IGwZ/F4mk+qX8+0E6PejxeD5/9tErVq16481k8qv3VXXNlpYWd5nfT0S0zMSybYzFYvavkUhqQMqH95LJUZfL9Wk6nZ4q2md+n2/T6nz++CbLan4rGFz5WnW1XBkIkKqq0A0Dk/G4fScaNf80zfg1RZkY17Rxr9f7xeLi4tiy5RgKhWh2drYZ+fzuSmBzE9GqgGW5bdMEu1xYkDLzD1FiQtcTlm2PSCm/1XX9ySs3LQCUlZWJVCpVb5rmu8z8OjMLACCiPBHdU1X1D4fDMZpKpfIv6v4DchEtKqF9lEYAAAAASUVORK5CYII=);",
    "table.rjbwindow div.cornerdragger",
    "width: 17px; height: 17px; margin: 0 0 -10px -10px; position: relative; top: -12px; left: -3px; cursor: nw-resize; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAh9JREFUOMut0EtrGmEUBuB3JhbctYssDBUEMbsYKvQvhIaGXGgW3fZvdFGwXXVR6Dp0Y5fOxUyi0HRGUZQJMRa1EIOLGug3QdQJDlWHQP3i6aI1vSmN0LN+ec57DjDjjEaje5zz/WKx+Dgajc4BgGdGIGxZ1jtN03z9fn/dMIwnAN6KswCMsfeSJPkcx4Ft2yiXy/cBQJwFkGV5wXVd9Ho9aJrWury8fHOjc0aj0RJjTJdl2ee6LhzHwe7u7nmz2XwA4PSfTYhoiTFm/AokEolzv9+/Va/Xv4xz4k0bdLtdqKp6FggE1gqFwlNVVU8EQfBPRYho2bIsXZKkhTGgKMrZ4uLiZi6Xe1YqlR4lk8nbRHRn4k+IKMIY0yVJmnddFxcXF1BVtREMBjcMw3heLBa30+m0cHV1RQCGfzX5E7BtG4qifAqFQuv5fP4aIKLfFovTgFarBUVRTsPh8Go2m31xfHw8EbhGxoAsy9eApmknkUhk8+Dg4OXR0dG2rusTAQAQiWih3W7rsizPDwaDMfBxZWVlK5VKvT48PNzOZDJTAQDwENHdRqMxPxgM0Gw2sbe3V+l0OquxWOxVNptdM01zIjAcDn8igiCUM5nMvmmaG9Vq9YPjOA+JyE4kEmxnZ0fodDoEAB6PB6L4/YWcc9RqtTqAzwAgAIBpmrcKhYK/UqlY8XicA4DX6/Vwzpc550MAX39kx5XmAFgA+vhf8w0HDYO01lIPVAAAAABJRU5ErkJggg==);",
    "table.rjbwindow div.content",
    "margin: 0 0 0 3px;; padding: 7px 4px 4px 4px; text-align: left; border-width: 0 2px 2px 2px; -moz-border-radius: 0 0 4px 4px; -webkit-border-bottom-left-radius: 4px; -webkit-border-bottom-right-radius: 4px; border-style: solid; border-color: #888; background-color: #eee;",
    "div.logfilecontainer",
    "overflow: scroll; position: relative; top: 0; padding: 4px; margin: 0;",
    "div.logfilecontainer div.logfileline",
    "font-family: courier new, courier; font-size: 14px; padding: 0 0 0 28px; margin: 0; text-indent: -25px; text-align: left;",
    "div.logfilecontainer pre.logfileline",
    "font-family: courier new, courier; font-size: 14px; padding: 0 0 0 5px; margin: 0; text-align: left;",
    "div.logfilecontainer .oddLine",
    "background-color: #ddd;"
  ]);

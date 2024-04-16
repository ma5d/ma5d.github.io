 

git 不小心提交不需要的文件夹，  
不删除本地文件，只在git中删除

```
#--cached不会把本地的文件删除
git rm -r --cached .vscode  
git commit -m 'delete .vscode'
git push

```

 

  

本文转自 [https://blog.csdn.net/tmaccs/article/details/113994455](https://blog.csdn.net/tmaccs/article/details/113994455)，如有侵权，请联系删除。
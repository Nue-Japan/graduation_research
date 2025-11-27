# database program

import psycopg2
from psycopg2 import sql,errors

# dataが送信され、分析を開始したらデータベースに全自動のように追加
# 例えば、data100~data199まで健康状況のテーブル（ID,cm,kg,adress,adress2,adress3,portal-code,state,phone-number...）,data200~299まで年齢別の病気状況などのテーブル


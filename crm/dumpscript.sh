createdb $1
psql $1 < dumpfile.txt

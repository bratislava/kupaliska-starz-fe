for file in /usr/share/nginx/html/static/js/*.js; do
    echo "Processing File $file"
    pcregrep --buffer-size=5000000 -o "(?<=%{)[^}]+(?=}%)" "$file" | uniq | while read var
    do
        val=$(printenv -- "$var")
        if [ ! -z "$val" ]
        then
            echo "VAR:[$var] has VALUE:[$val]. Replacing all occurences."
            sed -i "s@%{$var}%@$val@g" "$file"
        else
            echo "WARGNING: VAR:[$var] has no value. Not replacing."
        fi
    done
done
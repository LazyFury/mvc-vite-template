# 在mvc项目中与后端模板配合使用 vite

## 后端实现 golang （根据配置文件选择使用本地的 vite 服务地址或者静态文件地址，暂时不支持热更新）

```golang 

func vite(_path string, manifestJSON []byte) template.HTML {
	ext := path.Ext(_path)
	if config.VITE_DEBUG {
		if ext == ".js" {
			return template.HTML(`<script>/** Vite **/</script> <script type="module" src="` + (config.VITE_URL + _path) + `"></script> <script>/** Vite end **/</script>`)
		}
		if ext == ".css" || ext == ".scss" {
			return template.HTML(`<style>/** Vite **/</style> <link rel="stylesheet" href="` + (config.VITE_URL + _path) + `"> <style>/** Vite end **/</style>`)
		}
		return template.HTML(`unknown ext: ` + ext)

	}
	manifestData := make(map[string]map[string]any)

	if len(manifestJSON) >= 0 {
		if err := json.Unmarshal(manifestJSON, &manifestData); err != nil {
			log.Error("embed fs parse manifest error: " + err.Error())
			return template.HTML("parse manifest error: " + err.Error())
		}
	} else {
		manifestPath := path.Join(config.VITE_BUILD_DIR, "manifest.json")
		manifestFile, err := os.Open(manifestPath)
		if err != nil {
			log.Error("open manifest error: " + err.Error())
			return template.HTML("open manifest error: " + err.Error())
		}
		defer manifestFile.Close()
		if err := json.NewDecoder(manifestFile).Decode(&manifestData); err != nil {
			log.Error("parse manifest error: " + err.Error())
			return template.HTML("parse manifest error: " + err.Error())
		}
	}

	if _, ok := manifestData[_path]; !ok {
		log.Error("path not found in manifest: " + _path)
		return template.HTML("path not found in manifest: " + _path)
	}

	if _, ok := manifestData[_path]["file"]; !ok {
		log.Error("file not found in manifest: " + _path)
		return template.HTML("file not found in manifest: " + _path)
	}

	if ext == ".js" {

		jsFile := manifestData[_path]["file"].(string)
		if !strings.HasSuffix(jsFile, ".js") {
			log.Error("file not found in manifest: " + _path)
			return template.HTML("file not found in manifest: " + _path)
		}

		cssFiles := manifestData[_path]["css"]
		if cssFiles != nil {
			for _, cssFile := range cssFiles.([]any) {
				if !strings.HasSuffix(cssFile.(string), ".css") {
					log.Error("file not found in manifest: " + _path)
					return template.HTML("file not found in manifest: " + _path)
				}
			}
		}

		_html := `<script>/** Vite **/</script> <script type="module" src="` + jsFile + `"></script>`

		if cssFiles != nil {
			for _, cssFile := range cssFiles.([]any) {
				_html += `<link rel="stylesheet" href="` + cssFile.(string) + `">`
			}
		}

		_html += ` <script>/** Vite end **/</script>`

		return template.HTML(_html)

	}

	if ext == ".css" || ext == ".scss" {
		cssFile := manifestData[_path]["file"].(string)
		if !strings.HasSuffix(cssFile, ".css") {
			log.Error("file not found in manifest: " + _path)
			return template.HTML("file not found in manifest: " + _path)
		}

		return template.HTML(`<style>/** Vite **/</style> <link rel="stylesheet" href="` + cssFile + `"> <style>/** Vite end **/</style>`)
	}

	return template.HTML("unknown ext: " + ext)
}
```

## 上一步读取的 manifest.json 结构

```json
{
  "src/main.js": {
    "file": "assets/main-UFAnUDkY.js",
    "name": "main",
    "src": "src/main.js",
    "isEntry": true,
    "css": [
      "assets/main-DXeBf7ui.css"
    ]
  },
  "src/scss/main.scss": {
    "file": "assets/main-BL7-xVec.css",
    "src": "src/scss/main.scss",
    "isEntry": true
  }
}

```

## 在模版中使用，视具体情况而定，第一步定义一个模板辅助函数
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{.Extra.site.title}}</title>
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="{{.Extra.site.description}}">
    <meta name="keywords" content="{{.Extra.site.keywords}}">
    
    {{vite "src/main.js"}}
    {{vite "src/scss/main.scss"}}
</head>

```
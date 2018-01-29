[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)
# mobx-rest-axios-adapter

Axios adapter for awesome [mobx-rest](https://github.com/masylum/mobx-rest)

### Install
```
yarn add mobx-rest-axios-adapter
// or
npm i -S mobx-rest-axios-adapter
```

### How To Use

```
import axios from 'axios'
import {apiClient} from 'mobx-rest'
const createAdapter: any = require('mobx-rest-axios-adapter').default


// if you have custom axios config place it right before this line 
apiClient(createAdapter(axios), { commonOptions: { qs: {indices: false } } })
```
and you ready to go :D

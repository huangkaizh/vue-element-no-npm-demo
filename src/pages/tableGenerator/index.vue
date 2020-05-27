<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.TABLE_NAME"
        placeholder="表名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-input
        v-model="query.TABLE_COMMENT"
        placeholder="表别名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
      创建
    </el-button> -->
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
      <el-select
        v-model="selectedFields"
        multiple
        clearable
        collapse-tags
        class="filter-item"
        placeholder="请选择列"
      >
        <el-option
          v-for="item in fields"
          :key="item.value"
          :label="item.label"
          :value="item.name"
        >
        </el-option>
      </el-select>
    </div>
    <el-table
      v-loading="loading"
      :data="data"
      stripe
      style="width: 100%"
      @sort-change="sortChanged"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="表名">
              <span>{{ props.row.TABLE_NAME }}</span>
            </el-form-item>
            <el-form-item label="表别名">
              <span>{{ props.row.TABLE_COMMENT }}</span>
            </el-form-item>
            <el-form-item label="行数">
              <span>{{ props.row.TABLE_ROWS }}</span>
            </el-form-item>
            <el-form-item label="平均行长度">
              <span>{{ props.row.AVG_ROW_LENGTH }}</span>
            </el-form-item>
            <el-form-item label="数据长度">
              <span>{{ props.row.DATA_LENGTH }}</span>
            </el-form-item>
            <el-form-item label="引擎">
              <span>{{ props.row.ENGINE }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{
                props.row.CREATE_TIME.replace("T", " ").replace(".000Z", "")
              }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{
                props.row.UPDATE_TIME
                  ? props.row.UPDATE_TIME.replace("T", " ").replace(".000Z", "")
                  : "--"
              }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('TABLE_NAME')"
        prop="TABLE_NAME"
        label="表名"
        sortable="custom"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('TABLE_COMMENT')"
        prop="TABLE_COMMENT"
        label="表别名"
        sortable="custom"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('TABLE_ROWS')"
        prop="TABLE_ROWS"
        label="行数"
        sortable="custom"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('AVG_ROW_LENGTH')"
        prop="AVG_ROW_LENGTH"
        label="平均行长度"
        sortable="custom"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('DATA_LENGTH')"
        prop="DATA_LENGTH"
        label="数据长度"
        sortable="custom"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('ENGINE')"
        prop="ENGINE"
        label="引擎"
        sortable="custom"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('CREATE_TIME')"
        label="创建时间"
        sortable="custom"
        width="180"
      >
        <template slot-scope="{ row }">
          <span>{{
            row.CREATE_TIME.replace("T", " ").replace(".000Z", "")
          }}</span>
        </template></el-table-column
      >
      <el-table-column
        v-if="selectedFields.includes('UPDATE_TIME')"
        label="更新时间"
        sortable="custom"
        width="180"
      >
        <template slot-scope="{ row }">
          <span>{{
            row.UPDATE_TIME
              ? row.UPDATE_TIME.replace("T", " ").replace(".000Z", "")
              : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="!generatedTables.includes(row.TABLE_NAME)"
            type="primary"
            size="mini"
            @click="handleGenerate(row)"
          >
            生成
          </el-button>
          <el-button
            v-else
            size="mini"
            type="danger"
            @click="handleRegenerate(row)"
          >
            重新生成
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total > 0"
      :total="total"
      :current-page.sync="query.page"
      :page-size.sync="query.size"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="getData"
      @size-change="getData"
      class="pagination-margin"
    ></el-pagination>

    <el-dialog
      :title="textMap[generateDialogStatus]"
      :visible.sync="generateDialogFormVisible"
    >
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="表结构" name="tableStructure">
          <el-table
            v-loading="fieldsLoading"
            :data="fieldsData"
            stripe
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="字段名">
                    <span>{{ props.row.COLUMN_NAME }}</span>
                  </el-form-item>
                  <el-form-item label="字段别名">
                    <span>{{ props.row.COLUMN_COMMENT }}</span>
                  </el-form-item>
                  <el-form-item label="数据类型">
                    <span>{{ props.row.DATA_TYPE }}</span>
                  </el-form-item>
                  <el-form-item label="最大字符长度">
                    <span>{{ props.row.CHARACTER_MAXIMUM_LENGTH }}</span>
                  </el-form-item>
                  <el-form-item label="默认值">
                    <span>{{ props.row.COLUMN_DEFAULT }}</span>
                  </el-form-item>
                  <el-form-item label="键类型">
                    <span>{{ props.row.COLUMN_KEY }}</span>
                  </el-form-item>
                  <el-form-item label="能为空">
                    <span>{{ props.row.IS_NULLABLE }}</span>
                  </el-form-item>
                  <el-form-item label="其他">
                    <span>{{ props.row.EXTRA }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="COLUMN_NAME"
              label="字段名"
              sortable
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="COLUMN_COMMENT"
              label="字段别名"
              sortabl
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="DATA_TYPE"
              label="数据类型"
              sortabl
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="CHARACTER_MAXIMUM_LENGTH"
              label="最大字符长度"
              sortabl
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="COLUMN_DEFAULT"
              label="默认值"
              sortabl
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="COLUMN_KEY"
              label="键类型"
              sortabl
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="IS_NULLABLE"
              label="能为空"
              sortabl
              width="180"
            >
            </el-table-column>
            <el-table-column prop="EXTRA" label="其他" sortabl width="180">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="前端页面字段设置" name="webFieldsSettings">
          <div ref="jsoneditor" style="width:100%;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="generateDialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="generateLoading"
          @click="generate()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      generateLoading: false,
      editor: null,
      settings: null,
      activeName: "tableStructure",
      generateDialogStatus: "generate",
      generateDialogFormVisible: false,
      fieldsLoading: false,
      fieldsData: [],
      selectedFields: [
        "TABLE_NAME",
        "TABLE_COMMENT",
        "TABLE_ROWS",
        "AVG_ROW_LENGTH",
        "DATA_LENGTH",
        "ENGINE",
        "CREATE_TIME",
        "UPDATE_TIME"
      ],
      downloadLoading: false,
      fields: [
        { name: "TABLE_NAME", label: "表名" },
        { name: "TABLE_COMMENT", label: "表别名" },
        { name: "TABLE_ROWS", label: "行数" },
        { name: "AVG_ROW_LENGTH", label: "平均行长度" },
        { name: "DATA_LENGTH", label: "数据长度" },
        { name: "ENGINE", label: "引擎" },
        { name: "CREATE_TIME", label: "创建时间" },
        { name: "UPDATE_TIME", label: "更新时间" }
      ],
      rules: {
        name: [
          { required: true, message: "name is required", trigger: "change" }
        ],
        age: [{ required: true, message: "age is required", trigger: "change" }]
      },
      temp: {
        id: undefined,
        name: "",
        age: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建",
        generate: "生成",
        regenerate: "重新生成"
      },
      loading: false,
      data: [],
      total: 0,
      pageSizes: [10, 15, 20, 30, 50, 100],
      query: {
        page: 1,
        size: 10,
        sort: "",
        TABLE_NAME: "",
        TABLE_COMMENT: ""
      }
    }
  },
  computed: {
    generatedTables() {
      const generatedTables = window.tablesRouter.children.map(child => {
        return child.path
      })
      return generatedTables
    }
  },
  methods: {
    regenerate() {
      console.log("regenerate")
    },
    generate() {
      console.log("generate")
      _axios.post("/api/generate", this.settings).then(res => {
        console.log("generate res", res)
      })
    },
    generateSettings(table) {
      console.log("generateSettings table", table)
      console.log("this.fieldsData", this.fieldsData)
      const columns = this.fieldsData.map(field => {
        const rules = []
        if (field.ISNULLABLE === "NO") {
          rules.push({
            required: true,
            message: `${field.COLUMN_COMMENT}不能为空`,
            trigger: "change"
          })
        }
        return {
          type: "text",
          model: field.COLUMN_NAME,
          label: field.COLUMN_COMMENT,
          DB_DATA_TYPE: field.DATA_TYPE,
          sortable: true,
          width: 200,
          formItem: {
            type: "input",
            width: "200px",
            defaultValue: field.COLUMN_DEFAULT,
            placeholder: `请输入${field.COLUMN_COMMENT}`
          },
          rules: rules
        }
      })
      this.settings = {
        name: table.TABLE_NAME,
        label: table.TABLE_COMMENT,
        columns: columns,
        filters: this.fieldsData.map(field => {
          return field.COLUMN_NAME
        })
      }
      console.log("this.settings", this.settings)
    },
    handleTabsClick(tab) {
      console.log("handleTabsClick tab", tab)
      switch (tab.name) {
        case "webFieldsSettings":
          console.log("webFieldsSettings")
          if (!this.editor) {
            window.loadStyle(
              "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.4/jsoneditor.min.css"
            )
            window
              .loadScript(
                "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.4/jsoneditor.min.js"
              )
              .then(() => {
                console.log("jsoneditor loaded")
                const container = this.$refs.jsoneditor
                const options = {}
                this.editor = new JSONEditor(container, options)
                this.editor.set(this.settings)
              })
          } else {
            this.editor.set(this.settings)
          }
          break
        case "tableStructure":
          console.log("tableStructure")
          // const updatedJson = editor.get();
          break
        default:
          break
      }
    },
    handleRegenerate(row) {
      console.log("handleRegenerate")
      this.generateDialogStatus = "regenerate"
      this.openGenerateDialog(row)
    },
    handleGenerate(row) {
      console.log("handleGenerate")
      this.generateDialogStatus = "generate"
      this.openGenerateDialog(row)
    },
    openGenerateDialog(row) {
      this.generateDialogFormVisible = true
      this.fieldsLoading = true
      _axios
        .get("/api/column/query", { TABLE_NAME: row.TABLE_NAME })
        .then(res => {
          console.log("column query res", res)
          this.fieldsData = res.data
          this.generateSettings(row)
          this.fieldsLoading = false
        })
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    handleDelete(id) {
      this.loading = true
      _axios.get("/api/table/delete", { id }).then(res => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 2000
        })
        this.getData()
      })
    },
    jsonArrayToAoa(jsonArray) {
      if (!jsonArray || jsonArray.length === 0) {
        return []
      }
      const fieldNames = this.fields.map(field => {
        return field.name
      })
      const fieldLabels = this.fields.map(field => {
        return field.label
      })
      const aoa = jsonArray.map(json => {
        return fieldNames.map(fieldName => {
          return json[fieldName]
        })
      })
      aoa.unshift(fieldLabels)
      return aoa
    },
    handleDownload() {
      this.downloadLoading = true //https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.4/xlsx.full.min.js
      loadScript("https://unpkg.com/xlsx@0.15.4/dist/xlsx.full.min.js").then(
        () => {
          let wb = XLSX.utils.book_new()
          const aoa = this.jsonArrayToAoa(this.data)
          let ws = XLSX.utils.aoa_to_sheet(aoa)
          XLSX.utils.book_append_sheet(wb, ws, "user")
          XLSX.writeFile(wb, "table.xlsx")
          this.downloadLoading = false
        }
      )
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal, this.list)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        age: ""
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = "create"
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate()
      })
    },
    createData() {
      console.log("createData")
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log("createData valid: ", valid)
          this.loading = true
          _axios.post("/api/table/add", this.temp).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: "创建成功",
              type: "success",
              duration: 2000
            })
            this.getData()
          })
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Created Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = "update"
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.temp)
          _axios.post("/api/table/update", tempData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: "更新成功",
              type: "success",
              duration: 2000
            })
            this.getData()
          })
        }
      })
    },
    handleFilter() {
      this.query.page = 1
      this.getData()
    },
    sortChanged({ column, prop, order }) {
      console.log("column, prop, order", column, prop, order)
      if (!order) {
        this.query.sort = ""
        this.handleFilter()
        return
      }
      const sign = order === "ascending" ? "+" : "-"
      this.query.sort = sign + prop
      this.handleFilter()
    },
    getData() {
      console.log("table queryAll this.query", this.query)
      this.loading = true
      _axios.get("/api/table/queryAll", this.query).then(res => {
        this.data = res.data
        this.total = res.total
        const totalPageSize = Math.ceil(this.total / this.query.size) || 1
        if (this.query.page > totalPageSize) {
          this.query.page = this.query.page - 1
          this.getData()
        } else {
          this.loading = false
        }
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>

<template>
  <div ref="container" class="container">
    <el-steps :active="active" finish-status="success" align-center style="padding-top: 10px;">
      <el-step title="填写信息" />
      <el-step title="确认信息" />
      <el-step title="执行" />
    </el-steps>
    <div ref="step-1" class="step" :style="StepStyle1">
      <el-table
        ref="tableData"
        :data="tableData"
        :v-model="tableData"
        :height="tableHeight"
        style="width: 100%"
      >
        <el-table-column
          fixed
          prop="no"
          label="编号"
        >
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Policy"
          label="授权策略"
        />
        <el-table-column
          prop="way"
          label="方向"
        />
        <el-table-column
          prop="IpProtocol"
          label="IP协议"
        />
        <el-table-column
          prop="PortRange"
          label="端口范围"
        />
        <el-table-column
          prop="SourceCidrIp"
          label="授权目标"
        />
        <el-table-column
          prop="Description"
          label="描述"
        />
        <el-table-column fixed="right" label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row),drawer = true"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, tableData)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" round style="margin-left: 16px;position:absolute;bottom:5px;padding:12px 50px 12px 50px;" @click="drawer = true, handleAdd()">
        添加
      </el-button>

      <el-drawer
        ref="drawer"
        :title="drawerTitle"
        :visible.sync="drawer"
        size="40%"
      >
        <div class="drawer_content" style="margin-right:20px;">
          <el-form ref="addform" :model="addform" label-width="100px" class="addform">
            <el-form-item
              v-show="false"
              label="row"
              prop="row"
            >
              <el-input v-model="addform.row" />
            </el-form-item>
            <el-form-item
              label="授权策略"
              prop="Policy"
              :rules="[
                {required: true, message: '请选择授权策略', trigger: 'blur' }
              ]"
            >
              <el-select v-model="addform.Policy" placeholder="请选择行为">
                <el-option label="接受" value="accept" />
                <el-option label="拒绝" value="drop" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="方向"
              prop="way"
              :rules="[
                {required: true, message: '请选择方向', trigger: 'blur' }
              ]"
            >
              <el-select v-model="addform.way" placeholder="请选择方向">
                <el-option label="入方向" value="in" />
                <el-option label="出方向" value="out" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="IP协议"
              prop="IpProtocol"
              :rules="[
                {required: true, message: '请选择IP协议', trigger: 'blur' }
              ]"
            >
              <el-select v-model="addform.IpProtocol" placeholder="请选择IP协议" @change="ChangeIpProtocol">
                <el-option label="TCP" value="tcp" />
                <el-option label="UDP" value="udp" />
                <el-option label="ICMP" value="icmp" />
                <el-option label="GRE" value="gre" />
                <el-option label="ALL" value="all" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="端口范围"
              prop="PortRange"
              :rules="[
                { required: true, message: '请输入端口范围', trigger: 'blur' },
                { pattern: /^((([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])\/([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])))|(-1\/-1)$/, message: '请输入正确的端口范围(0-65535  如:80/80)', trigger: ['change'] }
              ]"
            >
              <el-input v-model="addform.PortRange" :disabled="disabledInput" placeholder="请填写端口范围(0-65535  如:80/80)" />
            </el-form-item>
            <el-form-item
              label="授权目标"
              prop="SourceCidrIp"
              :rules="[
                {required: true, message: '请输入授权目标', trigger: 'blur'},
                {pattern:/^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/([0-2]\d|3[0-2]|[0-9]))?$/, message: '请输入正确的IP地址(如: 1.1.1.1 或 1.1.1.1/24)', trigger: ['change']}
              ]"
            >
              <el-input v-model="addform.SourceCidrIp" placeholder="请填写授权目标(如: 1.1.1.1 或 1.1.1.1/24)" />
            </el-form-item>
            <el-form-item
              label="描述"
              prop="Description"
            >
              <el-input v-model="addform.Description" type="textarea" placeholder="请填写描述" :rows="4" />
            </el-form-item>
            <el-form-item style="position:absolute;right:15px;bottom:5px;">
              <el-button type="primary" @click="submitForm(drawerTitle, 'addform')">确定</el-button>
              <el-button @click="resetForm('addform')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="drawer_footer" />

      </el-drawer>
    </div>
    <div ref="step-2" class="step" :style="StepStyle2">
      <el-table
        ref="tableData"
        :data="tableData"
        :v-model="tableData"
        :height="tableHeight"
      >
        <el-table-column
          fixed
          prop="no"
          label="编号"
        >
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Policy"
          label="授权策略"
        />
        <el-table-column
          prop="way"
          label="方向"
        />
        <el-table-column
          prop="IpProtocol"
          label="IP协议"
        />
        <el-table-column
          prop="PortRange"
          label="端口范围"
        />
        <el-table-column
          prop="SourceCidrIp"
          label="授权目标"
        />
        <el-table-column
          prop="Description"
          label="描述"
        />
      </el-table>
    </div>
    <div ref="step-3" class="step" :style="StepStyle3">
      <el-collapse v-model="step3Collapse" @change="Changestep3Collapse">
        <el-collapse-item title="安全组 sg-5ko05nv1ochml812oihu" name="1">
          <el-table>
            <el-table-column
              fixed
              prop="no"
              label="编号"
            >
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="Policy"
              label="授权策略"
            />
            <el-table-column
              prop="way"
              label="方向"
            />
            <el-table-column
              prop="IpProtocol"
              label="IP协议"
            />
            <el-table-column
              prop="PortRange"
              label="端口范围"
            />
            <el-table-column
              prop="SourceCidrIp"
              label="授权目标"
            />
            <el-table-column
              prop="Description"
              label="描述"
            />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="安全组 sg-5ko05nv1occaj5x6mbko" name="2">
          <el-table>
            <el-table-column
              fixed
              prop="no"
              label="编号"
            >
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="Policy"
              label="授权策略"
            />
            <el-table-column
              prop="way"
              label="方向"
            />
            <el-table-column
              prop="IpProtocol"
              label="IP协议"
            />
            <el-table-column
              prop="PortRange"
              label="端口范围"
            />
            <el-table-column
              prop="SourceCidrIp"
              label="授权目标"
            />
            <el-table-column
              prop="Description"
              label="描述"
            />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="安全组 sg-5ko060xo8vkpmncs5x02" name="3">
          <el-table>
            <el-table-column
              fixed
              prop="no"
              label="编号"
            >
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="Policy"
              label="授权策略"
            />
            <el-table-column
              prop="way"
              label="方向"
            />
            <el-table-column
              prop="IpProtocol"
              label="IP协议"
            />
            <el-table-column
              prop="PortRange"
              label="端口范围"
            />
            <el-table-column
              prop="SourceCidrIp"
              label="授权目标"
            />
            <el-table-column
              prop="Description"
              label="描述"
            />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="安全组 sg-5ko060xo8vkpmldr1v0t" name="4">
          <el-table>
            <el-table-column
              fixed
              prop="no"
              label="编号"
            >
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="Policy"
              label="授权策略"
            />
            <el-table-column
              prop="way"
              label="方向"
            />
            <el-table-column
              prop="IpProtocol"
              label="IP协议"
            />
            <el-table-column
              prop="PortRange"
              label="端口范围"
            />
            <el-table-column
              prop="SourceCidrIp"
              label="授权目标"
            />
            <el-table-column
              prop="Description"
              label="描述"
            />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>

    <el-button type="primary" style="position:absolute;right:405px;bottom:5px;padding:12px 50px 12px 50px;" @click="show">show</el-button>

    <el-button type="primary" style="position:absolute;right:200px;bottom:5px;padding:12px 50px 12px 50px;" @click="forward">上一步</el-button>

    <el-button type="primary" style="position:absolute;right:5px;bottom:5px;padding:12px 50px 12px 50px;" @click="next">下一步</el-button>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Test',
  data() {
    return {
      active: 0,
      drawer: false,
      disabledInput: false,
      tableHeight: 200,
      tableWidth: 500,
      drawerTitle: '',
      step3Collapse: ['1', '2'],
      // tableData: [],
      tableData: [{
        Policy: '接受',
        way: '入方向',
        IpProtocol: 'all',
        PortRange: '-1/-1',
        SourceCidrIp: '1.1.1.1',
        Description: '测试'
      }, {
        Policy: '接受',
        way: '入方向',
        IpProtocol: 'tcp',
        PortRange: '8080/8080',
        SourceCidrIp: '2.2.2.2',
        Description: '测试'
      }, {
        Policy: '接受',
        way: '入方向',
        IpProtocol: 'tcp',
        PortRange: '3306/3306',
        SourceCidrIp: '3.3.3.3',
        Description: '测试'
      }, {
        Policy: '接受',
        way: '入方向',
        IpProtocol: 'tcp',
        PortRange: '22/22',
        SourceCidrIp: '4.4.4.4',
        Description: '测试'
      }
      ],
      addform: {
        row: '',
        Policy: '',
        way: '',
        IpProtocol: '',
        PortRange: '',
        SourceCidrIp: '',
        Description: ''
      },
      StepStyle1: {
        // width: this.getWidth
      },
      StepStyle2: {
        display: 'none'
      },
      StepStyle3: {
        display: 'none'
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  beforeMount: function() {
    this.getHeight()
    window.addEventListener('resize', this.getHeight, false)
  },
  mounted: function() {
    // this.getHeight()
    // window.addEventListener('resize', this.getHeight, false)
  },
  methods: {
    show() {
      console.log(this.tableData)
    },
    getHeight() {
      this.tableHeight = document.documentElement.clientHeight - 170
    },
    forward() {
      if (this.active-- < 2) this.active = 1
      if (this.active === 1) {
        this.StepStyle1.display = ''
        this.StepStyle2.display = 'none'
        this.StepStyle3.display = 'none'
      } else if (this.active === 2) {
        this.StepStyle1.display = 'none'
        this.StepStyle2.display = ''
        this.StepStyle3.display = 'none'
      } else if (this.active === 3) {
        this.StepStyle1.display = 'none'
        this.StepStyle2.display = 'none'
        this.StepStyle3.display = ''
      }
    },
    next() {
      if (this.tableData.length === 0) {
        this.$alert('请添加规则', '错误', {
          confirmButtonText: '确定'
          // callback: action => {
          //   this.$message({
          //     type: 'info',
          //     message: `action: ${action}`
          //   })
          // }
        })
      } else {
        if (this.active === 0) {
          this.active = 2
        } else {
          this.active++
          if (this.active === 1) {
            this.StepStyle1.display = ''
            this.StepStyle2.display = 'none'
            this.StepStyle3.display = 'none'
          } else if (this.active === 2) {
            this.StepStyle1.display = 'none'
            this.StepStyle2.display = ''
            this.StepStyle3.display = 'none'
          } else if (this.active === 3) {
            this.StepStyle1.display = 'none'
            this.StepStyle2.display = 'none'
            this.StepStyle3.display = ''
          }
        }
      }
    },
    handleAdd() {
      this.drawerTitle = '添加规则'
      this.disabledInput = false
      this['addform'] = {
        'Policy': '',
        'way': '',
        'IpProtocol': '',
        'PortRange': '',
        'SourceCidrIp': '',
        'Description': ''
      }
      // if (this.$refs['addform'] !== undefined) {
      //   this.$refs['addform'].resetFields()
      // }
      // this.$nextTick(() => {
      //   this.$refs['addform'].resetFields()
      // })
    },
    handleEdit(index, row) {
      this.drawerTitle = '修改规则'
      this.$nextTick(() => {
        // eslint-disable-next-line no-sequences
        this.$set(this.addform, 'row', index)
        if (row.Policy === '接受') {
          this.$set(this.addform, 'Policy', 'accept')
        } else if (row.Policy === '拒绝') {
          this.$set(this.addform, 'Policy', 'drop')
        }
        if (row.way === '入方向') {
          this.$set(this.addform, 'way', 'in')
        } else if (row.way === '出方向') {
          this.$set(this.addform, 'way', 'out')
        }
        if (row.IpProtocol === 'tcp' || row.IpProtocol === 'udp') {
          this.$set(this.addform, 'IpProtocol', row.IpProtocol)
          this.$set(this.addform, 'PortRange', row.PortRange)
        } else {
          this.$set(this.addform, 'IpProtocol', row.IpProtocol)
          this.disabledInput = true
        }
        this.$set(this.addform, 'SourceCidrIp', row.SourceCidrIp)
        this.$set(this.addform, 'Description', row.Description)
      })
    },
    handleDelete(index, row) {
      row.splice(index, 1)
    },
    submitForm(type, formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === '添加规则') {
            if (this[formName].Policy === 'accept' && this[formName].way === 'in') {
              this.tableData.push({
                'Policy': '接受',
                'way': '入方向',
                'IpProtocol': this[formName].IpProtocol,
                'PortRange': this[formName].PortRange,
                'SourceCidrIp': this[formName].SourceCidrIp,
                'Description': this[formName].Description
              })
            } else if (this[formName].Policy === 'accept' && this[formName].way === 'out') {
              this.tableData.push({
                'Policy': '接受',
                'way': '出方向',
                'IpProtocol': this[formName].IpProtocol,
                'PortRange': this[formName].PortRange,
                'SourceCidrIp': this[formName].SourceCidrIp,
                'Description': this[formName].Description
              })
            } else if (this[formName].Policy === 'drop' && this[formName].way === 'in') {
              this.tableData.push({
                'Policy': '拒绝',
                'way': '入方向',
                'IpProtocol': this[formName].IpProtocol,
                'PortRange': this[formName].PortRange,
                'SourceCidrIp': this[formName].SourceCidrIp,
                'Description': this[formName].Description
              })
            } else if (this[formName].Policy === 'drop' && this[formName].way === 'out') {
              this.tableData.push({
                'Policy': '拒绝',
                'way': '出方向',
                'IpProtocol': this[formName].IpProtocol,
                'PortRange': this[formName].PortRange,
                'SourceCidrIp': this[formName].SourceCidrIp,
                'Description': this[formName].Description
              })
            }
            this.active = 1
          } else if (type === '修改规则') {
            const index = this[formName].row
            if (this[formName].Policy === 'accept') {
              this.tableData[index].Policy = '接受'
            } else if (this[formName].Policy === 'drop') {
              this.tableData[index].Policy = '拒绝'
            }
            if (this[formName].way === 'in') {
              this.tableData[index].way = '入方向'
            } else if (this[formName].way === 'out') {
              this.tableData[index].way = '出方向'
            }
            this.tableData[index].IpProtocol = this[formName].IpProtocol
            this.tableData[index].PortRange = this[formName].PortRange
            this.tableData[index].SourceCidrIp = this[formName].SourceCidrIp
            this.tableData[index].Description = this[formName].Description
          } else {
            console.log('error submit!!')
            return false
          }
          this.drawer = false
        }
      })
    },
    resetForm(formName) {
      this[formName] = {
        'Policy': '',
        'way': '',
        'IpProtocol': '',
        'PortRange': '',
        'SourceCidrIp': '',
        'Description': ''
      }
      // if (this.$refs[formName] !== undefined) {
      //   this.$refs[formName].resetFields()
      // }
      // this.$nextTick(() => {
      //   this.$refs[formName].resetFields()
      // })
    },
    ChangeIpProtocol() {
      if (this.addform.IpProtocol === 'tcp' || this.addform.IpProtocol === 'udp') {
        this.disabledInput = false
      } else {
        this.$set(this.addform, 'PortRange', '-1/-1')
        this.disabledInput = true
      }
    },
    print(formName) {
      const formData = new FormData()
      for (const key in this[formName]) {
        formData.append(key, this[formName][key])
        console.log(formData.get(key))
      }
    }
  }
}

</script>

<style lang="scss" scoped>

</style>

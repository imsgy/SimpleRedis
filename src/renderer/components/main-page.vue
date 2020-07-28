<template>
    <div>
        <div class="sidebar">
            <span class="headSpan">
                <div class="headInput">
                    <router-link to="/"><i class="iconfont icon-shouye"></i></router-link>
                    <el-input prefix-icon="el-icon-search" placeholder="请输入key值" v-model="filter.params"
                              @keyup.native="fetch"></el-input>
                </div>
            </span>
            <span class="headTag">
                <el-tag>
                    <i class="el-icon-refresh" @click="fetch"></i>
                </el-tag>
                <el-tag>
                    <i class="el-icon-plus" @click="addName"></i>
                </el-tag>
            </span>
            <el-table :data="tableList" height="calc(100vh - 86px)" @row-click="clickRow" highlight-current-row
                      ref="multipleTable" id="sideTable">
                <el-table-column prop="type" label="类型" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-tag effect="dark" v-if="scope.row.r_type===1">{{scope.row.type}}</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.r_type===2">{{scope.row.type}}</el-tag>
                        <el-tag type="info" effect="dark" v-if="scope.row.r_type===3">{{scope.row.type}}</el-tag>
                        <el-tag type="danger" effect="dark" v-if="scope.row.r_type===4">{{scope.row.type}}</el-tag>
                        <el-tag type="warning" effect="dark" v-if="scope.row.r_type===5">{{scope.row.type}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <i class="el-icon-more-outline"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="rowEdit(scope.row, 1, 1)">刷新</el-dropdown-item>
                                <el-dropdown-item divided @click.native="rowEdit(scope.row, 2, 1)">设置过期时间
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="rowEdit(scope.row, 3, 1)">重命名</el-dropdown-item>
                                <el-dropdown-item @click.native="rowEdit(scope.row, 4, 1)">复制</el-dropdown-item>
                                <el-dropdown-item divided @click.native="rowEdit(scope.row, 5, 1)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="content">
            <el-tabs v-model="activeName" @tab-click="tabsClick" :stretch="true">
                <el-tab-pane name="1">
                    <span slot="label">
                        <i class="el-icon-copy-document"></i> 内容
                    </span>
                    <div class="tabsDiv">
                        <div v-if="redisType > 1" class="tabsTableDiv">
                            <el-tag class="contentTag">
                                <i class="el-icon-plus" @click="addKey"></i>
                            </el-tag>
                            <el-table height="calc(100vh - 100px)" :data="keyData" highlight-current-row
                                      ref="multipleKey" @row-click="keyClickRow">
                                <el-table-column key="1" prop="key" label="key" v-if="redisType===2"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column key="2" prop="index" label="index" v-if="redisType===3"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column key="3" prop="item" label="item" v-if="redisType===3"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column key="4" prop="member" label="member" v-if="redisType===4"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column key="5" prop="score" label="score" v-if="redisType===5"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column key="6" prop="member" label="member" v-if="redisType===5"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column key="7">
                                    <template slot-scope="scope">
                                        <i class="el-icon-edit" @click="rowEdit(scope.row, 3,2)"
                                           v-if="redisType===2"></i>
                                        <i class="el-icon-edit" @click="rowEdit(scope.row, 7,2)"
                                           v-if="redisType===5"></i>
                                        <i class="el-icon-delete" @click="rowEdit(scope.row, 5, 2)"></i>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="tabsInputDiv">
                            <el-input type="textarea" class="tabsInput" v-model="keyValueForm.params"></el-input>
                            <div class="addChangeButton">
                                <el-button type="primary" plain @click="saveContent" :disabled="oldParams === keyValueForm.params">保 存</el-button>
                                <el-select style="float: right; margin-right: 10px; width: 100px" v-model="viewType"
                                           @change="viewTypeChange">
                                    <el-option label="Raw" :value="1"></el-option>
                                    <el-option label="Json" :value="2" :disabled="viewVisible"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="2">
                    <span slot="label">
                        <i class="el-icon-monitor"></i> 控制台
                    </span>
                    <div class="terminalDiv">
                        <terminal :server="server" ref="terminal"></terminal>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="footer">
            <el-form :inline="true" lable-width="40px">
                <el-form-item label="索引数:">
                    <el-tag type="success" effect="plain">{{tableList.length}}</el-tag>
                </el-form-item>
                <el-divider direction="vertical"></el-divider>
                <el-form-item label="数据库:">
                    <el-select v-model="server.db" @change="dbChange">
                        <el-option
                                v-for="item in dbOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-divider direction="vertical"></el-divider>
                <el-form-item label="服务器:">
                    <el-tag type="danger" effect="plain">{{server.name}}</el-tag>
                </el-form-item>
                <el-divider direction="vertical"></el-divider>
                <el-form-item label="主机IP:">
                    <el-tag type="success" effect="plain">{{server.host}}:{{server.port}}</el-tag>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog
                title="添加Name"
                :visible.sync="dialogVisible"
                center
                width="30%"
                :close-on-click-modal="false">
            <el-form v-model="nameForm" ref="nameForm" label-width="80px">
                <el-form-item label="类型:">
                    <el-select v-model="nameForm.r_type" @change="redisTypeChange">
                        <el-option
                                v-for="item in rTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="键名:" required>
                    <el-input v-model="nameForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="nameSubmit">创建</el-button>
              </span>
        </el-dialog>
        <el-dialog
                title="添加"
                :visible.sync="keyDialogVisible"
                center
                width="30%"
                :close-on-click-modal="false">
            <el-form v-model="keyForm" ref="nameForm" label-width="100px">
                <el-form-item label="类型:">
                    <el-input v-model="rTypeOptions[redisType - 1].label" disabled></el-input>
                </el-form-item>
                <el-form-item label="key:" required v-if="redisType===2">
                    <el-input v-model="keyForm.params"></el-input>
                </el-form-item>
                <el-form-item label="位置:" required v-else-if="redisType===3">
                    <el-select v-model="keyForm.params">
                        <el-option :label="'head'" :key="'0'" :value="'0'"></el-option>
                        <el-option :label="'tail'" :key="'-1'" :value="'-1'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="member:" v-else-if="redisType===4" required>
                    <el-input v-model="keyForm.params"></el-input>
                </el-form-item>
                <span v-else>
                    <el-form-item label="member:" required>
                        <el-input v-model="keyForm.params"></el-input>
                    </el-form-item>
                    <el-form-item label="score:" required>
                        <el-input v-model="keyForm.score" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');">
                        </el-input>
                    </el-form-item>
                </span>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="keyDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="keySubmit">创建</el-button>
              </span>
        </el-dialog>
        <el-dialog
                :title="editTitle"
                :visible.sync="editDialogVisible"
                center
                width="30%"
                :close-on-click-modal="false">
            <el-form v-model="editForm" ref="editForm" label-width="140px" v-if="this.editForm.action === 2">
                <el-form-item label="RedisName：" required>
                    <el-input v-model="editForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="Expire(ms)：" required>
                    <el-input placeholder="请输入剩余过期时间" v-model="editForm.params"
                              onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"></el-input>
                </el-form-item>
            </el-form>
            <el-form v-model="editForm" ref="editForm" label-width="120px" v-if="this.editForm.action === 3">
                <span v-if="editForm.type===1">
                    <el-form-item label="OldName：" required>
                        <el-input v-model="editForm.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="NewName：" required>
                        <el-input placeholder="请输入name" v-model="editForm.params"></el-input>
                    </el-form-item>
                </span>
                <span v-if="editForm.type===2">
                    <el-form-item label="OldKey：" required>
                        <el-input v-model="editForm.key" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="NewKey：" required>
                        <el-input placeholder="请输入key" v-model="editForm.params"></el-input>
                    </el-form-item>
                </span>
            </el-form>
            <el-form v-model="editForm" ref="editForm" label-width="100px" v-if="this.editForm.action === 4">
                <el-form-item label="节点Name：" required>
                    <el-input placeholder="请输入name" v-model="editForm.params"></el-input>
                </el-form-item>
                <!--                <el-form-item label="Keep-Ex：" required>-->
                <!--                    <el-select v-model="editForm.is_expire">-->
                <!--                        <el-option :key="1" :label="'true'" :value="1"></el-option>-->
                <!--                        <el-option :key="0" :label="'false'" :value="0"></el-option>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->
            </el-form>
            <el-form v-model="editForm" ref="editForm" label-width="100px" v-if="this.editForm.action === 7">
                <el-form-item label="Member：" required>
                    <el-input v-model="editForm.key" disabled></el-input>
                </el-form-item>
                <el-form-item label="Score：" required>
                    <el-input placeholder="请输入score" v-model="editForm.params"
                              onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import terminal from "./terminal";
    import api from '../libs/api';

    export default {
        name: "main-page",
        components: {terminal},
        data() {
            return {
                filter: {
                    params: "",
                    cursor: 2
                },
                oldParams: "",
                viewType: 1,
                viewVisible: true,
                redisConn: null,
                activeName: "1",
                redisType: 1,
                tableList: [],
                dbOptions: [],
                server: {
                    name: "",
                    host: "",
                    port: "",
                    password: "",
                    db: 0
                },
                keyData: [],
                dialogVisible: false,
                keyDialogVisible: false,
                nameForm: {
                    name: "",
                    r_type: 1
                },
                keyForm: {
                    name: "",
                    r_type: "",
                    params: "",
                    score: "0"
                },
                valueForm: {
                    name: "",
                    r_type: 0
                },
                keyValueForm: {
                    name: "",
                    r_type: 1,
                    key: "",
                    params: "",
                    action: 6,
                    type: 2,
                    score: 0,
                },
                rTypeOptions: [
                    {label: "string", value: 1},
                    {label: "hash", value: 2},
                    {label: "list", value: 3},
                    {label: "set", value: 4},
                    {label: "zset", value: 5}
                ],
                typeOptions: [
                    {label: "Raw", value: 1},
                    {label: "Json", value: 2}
                ],
                editDialogVisible: false,
                editTitle: "",
                editForm: {
                    name: "",
                    key: "",
                    r_type: 0,
                    action: "",
                    params: "",
                    is_expire: 0,
                    type: 1
                },
            };
        },
        watch: {
            tableList: function () {
                if (this.tableList.length > 0) {
                    this.$refs.multipleTable.setCurrentRow(this.tableList[0]);
                }
            },
            keyData: function () {
                if (this.keyData.length > 0) {
                    this.$refs.multipleKey.setCurrentRow(this.keyData[0]);
                }
            },
            'keyValueForm.params': function () {
                if (this.keyValueForm.params) {
                    try{
                        JSON.parse(this.keyValueForm.params);
                        this.viewVisible = false;
                    }catch (e) {
                        this.viewVisible = true;
                    }
                }
            },
        },
        created() {
            let server = JSON.parse(localStorage.getItem("server"));
            this.server = {...server};
            this.redisConn = this.$redis(this.server);
            this.fetch();
            for (let i = 0; i < 16; i++) {
                this.dbOptions.push({
                    value: i,
                    label: i
                });
            }
        },
        mounted() {
            let sideDom = document.getElementById("sideTable");
            sideDom.addEventListener("scroll", function () {
                let scrollDistance = sideDom.scrollHeight - sideDom.scrollTop - sideDom.clientHeight;
                console.log(scrollDistance);
                if (scrollDistance <= 0) {
                    this.scrollFetch();
                }
            })
        },
        methods: {
            fetch: function () {
                if (this.activeName === '2') {
                    this.$refs.terminal.initData();
                }
                this.viewType = 1;
                this.keyData = [];
                this.oldParams = "";
                this.keyValueForm.params = "";
                this.filter.cursor = 0;
                api.RedisInfo(this.redisConn, this.filter).then((res) => {
                    this.tableList = res.result;
                    this.filter.cursor = res.cursor;
                    if (this.tableList.length > 0) {
                        this.clickRow(this.tableList[0]);
                    }
                }).catch((err) => {
                    this.$layer_message(`请求失败:${err}`);
                });

            },
            scrollFetch: function () {
                // 滚动刷新
                api.RedisInfo(this.redisConn, this.filter).then((res) => {
                    this.tableList.concat(res.result);
                    this.filter.cursor = res.cursor;
                }).catch((err) => {
                    this.$layer_message(`请求失败:${err}`);
                });
            },
            dbChange: function () {
                // 更新链接
                this.redisConn = this.$redis(this.server);
                this.fetch();
            },
            addName: function () {
                this.dialogVisible = true;
                this.nameForm = {r_type: 1, name: ""};
            },
            addKey: function () {
                this.keyDialogVisible = true;
                this.keyForm = {
                    name: this.keyValueForm.name,
                    r_type: this.keyValueForm.r_type,
                    score: "0",
                };
            },
            nameSubmit: function () {
                if (!this.nameForm.name) {
                    this.$layer_message("请输入name值");
                    return false;
                }
                api.RedisName(this.redisConn, this.nameForm).then(() => {
                    this.$layer_message("创建成功", "success");
                    this.fetch();
                    this.dialogVisible = false;
                }).catch((err) => {
                    this.$layer_message(`操作失败:${err}`);
                });
            },
            keySubmit: function () {
                if (!this.keyForm.params && this.keyForm.r_type === 2) {
                    this.$layer_message("请输入key值");
                    return false;
                }
                if (!this.keyForm.params && this.keyForm.r_type === 3) {
                    this.$layer_message("请输入位置");
                    return false;
                }
                if (!this.keyForm.params && this.keyForm.r_type === 4) {
                    this.$layer_message("请输入value值");
                    return false;
                }
                if (!this.keyForm.score && this.keyForm.r_type === 5) {
                    this.$layer_message("请输入score值");
                    return false;
                }
                api.RedisKey(this.redisConn, this.keyForm).then(() => {
                    this.$layer_message("创建成功", "success");
                    this.fetch();
                    this.keyDialogVisible = false;
                }).catch((err) => {
                    this.$layer_message(`操作失败:${err}`);
                });
            },
            redisTypeChange: function () {
                this.nameForm.name = "";
            },
            clickRow: function (row) {
                this.redisType = row.r_type;
                this.valueForm.r_type = row.r_type;
                this.valueForm.name = row.name;
                this.keyValueForm.params = "";
                this.keyValueForm.value = "";
                api.RedisNameValue(this.redisConn, this.valueForm).then(res => {
                    if (row.r_type === 1) {
                        this.keyValueForm.params = res;
                        this.oldParams = res;
                        this.keyValueForm.r_type = this.redisType;
                        this.keyValueForm.name = row.name;
                        this.keyValueForm.key = "";
                    } else {
                        this.keyData = [...res];
                        if (this.keyData.length > 0) {
                            let keyFirst = this.keyData[0];
                            this.keyClickRow(keyFirst);
                        }
                    }
                }).catch((err) => {
                    this.$layer_message(`请求异常:${err}`);
                });
            },
            rowEdit: function (row, action, type) {
                this.editForm.action = action;
                this.editForm.r_type = row.r_type;
                this.editForm.name = row.name;
                this.editForm.type = type;
                if (action === 1) {
                    // reload
                    this.fetch();
                } else if (action === 2) {
                    // set ex
                    this.editForm.params = "-1";
                    this.editDialogVisible = true;
                    this.editTitle = "过期时间";
                } else if (action === 3) {
                    // rename
                    if (type === 2) {
                        this.editForm.key = row.key;
                    }
                    this.editForm.params = "";
                    this.editDialogVisible = true;
                    this.editTitle = "重命名";
                } else if (action === 4) {
                    // 复制
                    this.editForm.params = "";
                    this.editDialogVisible = true;
                    this.editTitle = "复制"
                } else if (action === 5) {
                    // 5-删除
                    let delName = row.name;
                    if (type === 2) {
                        if (this.editForm.r_type === 2) {
                            delName = row.key;
                        } else if (this.editForm.r_type === 3) {
                            delName = row.item;
                        } else if (this.editForm.r_type === 4 || this.editForm.r_type === 5) {
                            delName = row.member;
                        } else {
                            delName = "";
                        }
                    }
                    this.editForm.params = delName;
                    this.$confirm("确认要删除 " + delName + " 吗？", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        this.editSubmit();
                    }).catch(() => {
                        this.$layer_message("操作已取消", "info")
                    })
                } else if (action === 7) {
                    // 7-有序集合设置score
                    if (type === 2) {
                        this.editForm.key = row.member;
                    }
                    this.editForm.params = "";
                    this.editDialogVisible = true;
                    this.editTitle = "修改Score"
                } else {
                    this.$layer_message("无效的操作")
                }
            },
            editSubmit: function () {
                if (!this.editForm.params) {
                    this.$layer_message("参数不完整");
                    return false
                }
                api.RedisEdit(this.redisConn, this.editForm).then(() => {
                    this.$layer_message("操作成功", "success");
                    this.fetch();
                    this.editDialogVisible = false;
                    this.editForm.type = 1;
                }).catch((err) => {
                    this.$layer_message(`操作失败:${err}`)
                })
            },
            keyClickRow: function (row) {
                this.keyValueForm.params = "";
                this.keyValueForm.name = row.name;
                this.keyValueForm.r_type = row.r_type;
                if (this.valueForm.r_type === 1) {
                    // 字符串
                    console.log("字符串不处理");
                } else if (this.valueForm.r_type === 4) {
                    // set和z-set
                    this.oldParams = row.member;
                    this.keyValueForm.params = row.member;
                    this.keyValueForm.key = row.member;
                } else if (this.valueForm.r_type === 5) {
                    this.oldParams = row.member;
                    this.keyValueForm.params = row.member;
                    this.keyValueForm.key = row.member;
                    this.keyValueForm.score = row.score;
                } else {
                    if (this.valueForm.r_type === 2) {
                        // hash
                        this.keyValueForm.key = row.key;
                    } else if (this.valueForm.r_type === 3) {
                        // list
                        this.keyValueForm.key = row.index;
                    }
                    api.RedisKeyValue(this.redisConn, this.keyValueForm).then(res => {
                        this.keyValueForm.params = res;
                        this.oldParams = res;
                    }).catch((err) => {
                        this.$layer_message(`请求异常:${err}`);
                    });
                }
            },
            tabsClick: function () {
                if (this.activeName === '2') {
                    this.$refs.terminal.initData();
                }
            },
            saveContent: function () {
                this.keyValueForm.action = 6;
                api.RedisEdit(this.redisConn, this.keyValueForm).then(() => {
                    this.fetch();
                }).catch((err) => {
                    this.$layer_message(`操作失败:${err}`)
                });
            },
            viewTypeChange: function () {
                if (this.viewType === 2) {
                    let formatParams = this.keyValueForm.params;
                    try {
                        let obj = JSON.parse(formatParams);
                        formatParams = JSON.stringify(obj, undefined, 4);
                    } catch (e) {
                        console.log("非Json类型")
                    }
                    this.keyValueForm.params = formatParams
                }
            }
        }
    };
</script>

<style scoped>
    .sidebar {
        display: inline;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 30px;
        overflow-y: scroll;
        width: 300px;
        border-right: 1px solid beige;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .headSpan {
        position: fixed;
        z-index: 999;
    }

    .headInput {
        display: inline-flex;
        position: relative;
        top: 5px;
    }

    .headTag {
        float: right;
        margin-right: 5px;
        top: 40px;
        position: relative;
        z-index: 10;
    }

    .sidebar .el-tag {
        margin-left: 3px;
        margin-top: 5px;
    }

    .sidebar .el-table {
        top: 10px;
    }

    .content {
        display: inline;
        position: absolute;
        top: 0;
        bottom: 30px;
        overflow-y: scroll;
        border-right: 1px solid beige;
        margin-left: 305px;
        width: calc(100% - 306px);
    }

    .content::-webkit-scrollbar {
        width: 0;
    }

    .content .tabsTable {
        width: 200px;
    }

    .contentTag {
        float: right;
        margin-right: 5px;
        top: 30px;
        position: relative;
        z-index: 10;
    }

    .footer {
        bottom: 0;
        height: 40px;
        position: fixed;
        width: 100%;
        background-color: #f5f5f5;
        padding-left: 20px;
        padding-top: 7px;
        font-size: 16px;
    }

    .footer .el-select {
        width: 70px;
    }

    .footer .el-divider {
        margin-top: 8px;
    }

    .tabsDiv {
        display: inline-flex;
        bottom: 30px;
        width: 100%;
        border: 1px solid beige;
    }

    >>> .el-dialog.el-dialog--center {
        min-width: 10% !important;
    }

    >>> .el-dialog.el-dialog--center .el-dialog__header {
        border-bottom: 1px solid #f5f5f5;
        background-color: #f5f5f5 !important;
    }

    >>> .el-dialog.el-dialog--center .el-dialog__footer {
        border-top: 1px solid #f5f5f5;
        background-color: #f5f5f5 !important;
    }

    .dialog-footer {
        margin-top: 5px;
    }

    >>> .el-table__body tr.current-row > td {
        background-color: #C0C0C0 !important;
        font-size: 12px;
        color: #000000;
    }

    .tabsInputDiv {
        width: 100%;
        height: calc(100vh - 100px) !important;
    }

    .tabsTableDiv {
        width: 250px;
        border-right: 1px solid beige;
        height: calc(100vh - 78px);
        margin-top: -25px;
    }

    .tabsInput {
        margin-left: 1px;
        width: 99%;
    }

    >>> .el-textarea__inner {
        height: calc(100vh - 200px) !important;
    }

    .addChangeButton {
        margin-left: 20px;
        margin-top: 20px;
    }

    .el-dropdown-link {
        cursor: pointer;
        z-index: 100;
    }

    >>> .terminalDiv {
        width: 100%;
        height: calc(100vh - 100px);
    }

    .el-icon-delete {
        float: right;
        color: #f56c6c;
        font-size: 16px;
    }

    .el-icon-edit {
        color: #409eff;
        font-size: 16px;
    }

    .icon-shouye {
        font-size: 30px;
        color: #409eff;
        margin-left: 10px;
    }

    >>> .el-input.el-input--small.el-input--prefix {
        margin-left: 10px;
        width: 240px;
    }

    >>> .router-link-active {
        text-decoration: blink !important;
    }
</style>
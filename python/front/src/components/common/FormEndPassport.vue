<template>
    <div class="summary">
        <div class="summary__container"
             :class="{ 'summary__container--open': showAutoParams }">
            <div class="summary__card card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Дополнительные требования:</h5>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <textarea class="form-control"
                                  style="height: 150px; resize: none"
                                  name="addReqarea"
                                  id="addReqarea" />
                    </div>
                </div>
            </div>
            <div class="summary__cards__grid-wrapper">
                <div class="summary__card card mb-4"
                     v-for="item in passport.slice(0, 2)"
                     :key="item.id">
                    <div class="card-header">
                        <h5 class="mb-0"> {{ item.name }}</h5>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <input :placeholder="item.placeHolder"
                                   v-model="passport[item.model]"
                                   class="form-control" />
                        </div>
                    </div>
                </div>

                <div class="summary__card card mb-4"
                     v-for="item in passport.slice(2, 5)"
                     :key="item.id">
                    <div class="card-header">
                        <h5 class="mb-0"> {{ item.name }}</h5>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <input :type="item.type"
                                   :placeholder="item.placeHolder"
                                   v-model="passport[item.model]"
                                   class="form-control" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import passport from '@/assets/staticJsons/passport.json';
export default {
    props: {
        showAutoParams: Boolean,
    },
    setup() {
        return {
            passport
        }
    }
}
</script>
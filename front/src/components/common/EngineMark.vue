<template>
  <div class="fixed-mark__wrapper">
    <div class="fixed-mark__container">
      <div class="fixed-mark lead mb-3 form-control">{{ mark }}</div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue';
import { useQuestionsStore } from '@/store/questions';
export default {
  setup() {
    const mark = ref();
    const markArr = ref(['X', "X", "X", "X", "X", "X", "X", ""]);
    const questionsStore = useQuestionsStore();
    const questions = computed(() => questionsStore.questions);

    const paramToMark = computed(() => {
      return {
        // 1 
        valveType: questions.value.find((e) => e.inputName == 'valve_type').value,
        forceOpen: questions.value.find((e) => e.inputName == 'force_open').value,
        needBellows: questions.value.find((e) => e.inputName == 'need_bellows').value,
        // 2
        DN: questions.value.find((e) => e.inputName == 'pressureAnswersGroup').answers.find((e) => e.inputName == 'DN').value,
        // 3
        PN: questions.value.find((e) => e.inputName == 'pressureAnswersGroup').answers.find((e) => e.inputName == 'PN').value,
        // 4
        joiningType: questions.value.find((e) => e.inputName == 'joining_type').value,
        // 5
        contactType: questions.value.find((e) => e.inputName == 'contact_type').value,
        // 6
        material: questions.value.find((e) => e.inputName == 'envAnswersGroup')
          .answers.find((e) => e.inputName == 'material').value,
        // 7
        openCloseType: questions.value.find((e) => e.inputName == 'markAnswersGroup').answers.find((e) => e.inputName == 'open_close_type').value,
        // 8
        inletFlange: questions.value.find((e) => e.inputName == 'inlet_flange').value,
        outletFlange: questions.value.find((e) => e.inputName == 'outlet_flange').value,
      }
    })

    const checkFirstParam = () => {
      if (paramToMark.value.valveType || paramToMark.value.forceOpen || paramToMark.value.needBellows) {
        if (paramToMark.value.valveType == "В") {
          if (paramToMark.value.forceOpen && paramToMark.value.needBellows) {
            markArr.value[0] = "AM211"
          } else if (!paramToMark.value.forceOpen && paramToMark.value.needBellows) {
            markArr.value[0] = "AM212"
          } else if (paramToMark.value.forceOpen && !paramToMark.value.needBellows) {
            markArr.value[0] = "AM213"
          } else {
            markArr.value[0] = "AM214"
          }
        } else if (paramToMark.value.valveType == "Н") {
          if (paramToMark.value.forceOpen) {
            markArr.value[0] = "AM220"
          } else {
            markArr.value[0] = "AM219"
          }
        }
      }
    };

    const checkSecondParam = () => {
      if (paramToMark.value.DN) {
        markArr.value[1] = paramToMark.value.DN;
      }
    }

    const checkThirdParam = () => {
      if (paramToMark.value.PN) {
        markArr.value[2] = paramToMark.value.PN
      }
    }

    const checkFourthParam = () => {
      const connectionParams = {
        "В": {
          "Фланцевое": "3",
          "Под приварку": "4",
          "Цапковое": "1",
          "Штуцерно-торцовое": "2",
          "Штуцерное": "5",
          "Муфтовое": "6",
          "Ниппельное": "7",
          "Кламповое": "8"
        },
        "Н": {
          "Фланцевое": "3",
          "Под приварку": "4",
          "Цапковое": "7",
          "Штуцерно-торцовое": "9",
          "Штуцерное": "6",
          "Муфтовое": "8",
          "Ниппельное": "5",
          "Кламповое": "2"
        }
      };
      if (paramToMark.value.valveType && paramToMark.value.joiningType) {
        markArr.value[3] = connectionParams[paramToMark.value.valveType][paramToMark.value.joiningType]
      }
    }

    const checkFifthParam = () => {
      const contactParams = {
        "металл-неметалл": "2",
        "металл-металл": "3",
      }
      if (paramToMark.value.contactType) {
        markArr.value[4] = contactParams[paramToMark.value.contactType]
      }
    }

    const checkSixthParam = () => {
      const materialParams = {
        "25Л": "1",
        "12Х18Н9ТЛ": "2",
        "20ГЛ": "3",
        "12Х18Н12М3ТЛ": "4"
      }
      if (paramToMark.value.material) {
        markArr.value[5] = materialParams[paramToMark.value.material]
      }
    }

    const checkSevenParam = () => {
      const openCloseType = {
        "открытого типа": "1",
        "закрытого типа": "0"
      }
      if (paramToMark.value.openCloseType) {
        markArr.value[6] = openCloseType[paramToMark.value.openCloseType]
      }
    }

    const checkEightParam = () => {
      if (paramToMark.value.inletFlange && paramToMark.value.outletFlange) {
        markArr.value[7] = '.' + paramToMark.value.inletFlange + '/' + paramToMark.value.outletFlange
      }
    }

    const updateMark = () => {
      mark.value = markArr.value[0] + '.' +
        markArr.value[1] + '.' +
        markArr.value[2] + '.' +
        markArr.value[3] +
        markArr.value[4] +
        markArr.value[5] +
        markArr.value[6] +
        markArr.value[7];
      questionsStore.setQuestionValue('mark', mark.value)
    }

    watch(paramToMark, (newVal) => {
      checkFirstParam();
      checkSecondParam();
      checkThirdParam();
      checkFourthParam();
      checkFifthParam();
      checkSixthParam();
      checkSevenParam();
      checkEightParam();
      updateMark();
    }, { deep: true, immediate: true })

    return {
      mark
    }

  }
}

</script>
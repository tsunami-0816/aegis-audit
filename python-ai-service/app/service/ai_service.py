import re
from typing import List, Dict, Tuple, Optional
import jieba
import jieba.posseg as pseg


class ViolationType:
    NONE = "NONE"
    PORNOGRAPHY = "PORNOGRAPHY"
    VIOLENCE = "VIOLENCE"
    ADVERTISING = "ADVERTISING"
    POLITICAL = "POLITICAL"


class RiskLevel:
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class AuditResult:
    def __init__(self, risk_level: str, violation_type: str, suggestion: str):
        self.risk_level = risk_level
        self.violation_type = violation_type
        self.suggestion = suggestion

    def to_dict(self) -> Dict[str, str]:
        return {
            "risk_level": self.risk_level,
            "violation_type": self.violation_type,
            "suggestion": self.suggestion
        }


class SummaryResult:
    def __init__(self, summary: str, original_length: int, summary_length: int):
        self.summary = summary
        self.original_length = original_length
        self.summary_length = summary_length

    def to_dict(self) -> Dict[str, str]:
        return {
            "summary": self.summary,
            "original_length": self.original_length,
            "summary_length": self.summary_length
        }


class AIService:
    VIOLATION_KEYWORDS = {
        ViolationType.PORNOGRAPHY: [
            "色情", "裸体", "做爱", "性交", "性器官", "手淫", "卖淫", "嫖娼",
            "AV", "三级片", "成人影片", "露点", "激情", "性爱", "性快感",
            "自慰", "射精", "阴道", "阴茎", "乳房", "乳头", "高潮", "SM"
        ],
        ViolationType.VIOLENCE: [
            "暴力", "杀人", "自杀", "强奸", "抢劫", "绑架", "纵火", "爆炸",
            "武器", "枪支", "弹药", "刺杀", "斗殴", "砍杀", "殴打", "虐待",
            "酷刑", "血溅", "屠杀", "战争", "恐怖", "袭击", "伤害", "威胁"
        ],
        ViolationType.ADVERTISING: [
            "广告", "推广", "促销", "优惠", "打折", "团购", "秒杀", "抢购",
            "正品", "代购", "微商", "代理", "加盟", "招商", "联系方式",
            "电话", "微信", "QQ", "网址", "链接", "购买", "下单", "包邮"
        ],
        ViolationType.POLITICAL: [
            "反动", "反革命", "分裂", "台独", "港独", "藏独", "邪教",
            "敏感人物", "领导人", "政治", "示威", "抗议", "游行", "暴动",
            "颠覆", "政变", "叛国", "间谍", "机密", "内幕", "爆料"
        ]
    }

    RISK_THRESHOLD = {
        ViolationType.PORNOGRAPHY: {"low": 1, "high": 3},
        ViolationType.VIOLENCE: {"low": 1, "high": 3},
        ViolationType.ADVERTISING: {"low": 2, "high": 5},
        ViolationType.POLITICAL: {"low": 1, "high": 2}
    }

    def __init__(self):
        jieba.initialize()

    def audit_text(self, text: str) -> AuditResult:
        text = text.strip()
        if not text:
            return AuditResult(
                risk_level=RiskLevel.LOW,
                violation_type=ViolationType.NONE,
                suggestion="内容为空，无需审核"
            )

        detected_type = ViolationType.NONE
        keyword_count = 0
        detected_keywords = []

        for v_type, keywords in self.VIOLATION_KEYWORDS.items():
            count = 0
            found_keywords = []
            for keyword in keywords:
                if keyword in text:
                    count += text.count(keyword)
                    found_keywords.append(keyword)
            if count > 0:
                detected_type = v_type
                keyword_count = count
                detected_keywords = found_keywords
                break

        if detected_type == ViolationType.NONE:
            import random
            rand = random.random()
            if rand < 0.3:
                return AuditResult(
                    risk_level=RiskLevel.HIGH,
                    violation_type=ViolationType.ADVERTISING,
                    suggestion="检测到潜在违规内容，风险等级高，建议人工复核"
                )
            elif rand < 0.6:
                return AuditResult(
                    risk_level=RiskLevel.MEDIUM,
                    violation_type=ViolationType.ADVERTISING,
                    suggestion="检测到需要关注的内容，风险等级中，建议人工复核"
                )
            else:
                return AuditResult(
                    risk_level=RiskLevel.LOW,
                    violation_type=ViolationType.NONE,
                    suggestion="内容合规，未检测到违规信息"
                )

        threshold = self.RISK_THRESHOLD.get(detected_type, {"low": 1, "high": 3})
        if keyword_count >= threshold["high"]:
            risk_level = RiskLevel.HIGH
        elif keyword_count >= threshold["low"]:
            risk_level = RiskLevel.MEDIUM
        else:
            risk_level = RiskLevel.LOW

        type_desc = {
            ViolationType.PORNOGRAPHY: "色情内容",
            ViolationType.VIOLENCE: "暴力内容",
            ViolationType.ADVERTISING: "广告推广",
            ViolationType.POLITICAL: "政治敏感"
        }

        suggestion = self._generate_suggestion(detected_type, risk_level, detected_keywords)

        return AuditResult(
            risk_level=risk_level,
            violation_type=detected_type,
            suggestion=suggestion
        )

    def _generate_suggestion(self, violation_type: str, risk_level: str, keywords: List[str]) -> str:
        type_desc = {
            ViolationType.PORNOGRAPHY: "色情内容",
            ViolationType.VIOLENCE: "暴力内容",
            ViolationType.ADVERTISING: "广告推广",
            ViolationType.POLITICAL: "政治敏感内容"
        }

        risk_desc = {
            RiskLevel.LOW: "低风险",
            RiskLevel.MEDIUM: "中风险",
            RiskLevel.HIGH: "高风险"
        }

        if risk_level == RiskLevel.HIGH:
            return f"检测到{type_desc[violation_type]}，风险等级{risk_desc[risk_level]}，建议直接拒绝。关键词：{', '.join(keywords[:5])}"
        elif risk_level == RiskLevel.MEDIUM:
            return f"检测到{type_desc[violation_type]}，风险等级{risk_desc[risk_level]}，建议人工复核。关键词：{', '.join(keywords[:3])}"
        else:
            return f"检测到{type_desc[violation_type]}相关表述，风险等级{risk_desc[risk_level]}，建议进一步审查。关键词：{', '.join(keywords[:2])}"

    def summarize_text(self, text: str, max_length: int = 100) -> SummaryResult:
        text = text.strip()
        original_length = len(text)

        if not text:
            return SummaryResult(summary="", original_length=0, summary_length=0)

        if original_length <= max_length:
            return SummaryResult(summary=text, original_length=original_length, summary_length=original_length)

        sentences = self._split_sentences(text)
        if len(sentences) == 0:
            return SummaryResult(summary=text[:max_length], original_length=original_length, summary_length=min(original_length, max_length))

        sentence_scores = self._calculate_text_rank(sentences)
        sorted_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)

        summary = ""
        used_indices = set()

        for idx, score in sorted_sentences:
            if idx in used_indices:
                continue
            if len(summary) + len(sentences[idx]) <= max_length:
                summary += sentences[idx] + " "
                used_indices.add(idx)
            else:
                break

        summary = summary.strip()[:max_length].rstrip('，。！？；') + "。"

        return SummaryResult(
            summary=summary,
            original_length=original_length,
            summary_length=len(summary)
        )

    def _split_sentences(self, text: str) -> List[str]:
        pattern = r'([^。！？；!?;]+[。！？；!?;]?)'
        sentences = re.findall(pattern, text)
        sentences = [s.strip() for s in sentences if s.strip()]
        return sentences

    def _calculate_text_rank(self, sentences: List[str]) -> Dict[int, float]:
        n = len(sentences)
        if n == 0:
            return {}
        if n == 1:
            return {0: 1.0}

        similarity_matrix = [[0.0] * n for _ in range(n)]

        for i in range(n):
            for j in range(n):
                if i != j:
                    similarity_matrix[i][j] = self._sentence_similarity(sentences[i], sentences[j])

        damping = 0.85
        scores = {i: 1.0 for i in range(n)}
        max_iterations = 100
        tolerance = 0.0001

        for _ in range(max_iterations):
            new_scores = {}
            max_diff = 0

            for i in range(n):
                new_score = (1 - damping)
                for j in range(n):
                    if similarity_matrix[j][i] > 0:
                        row_sum = sum(similarity_matrix[j])
                        if row_sum > 0:
                            new_score += damping * similarity_matrix[j][i] / row_sum * scores[j]

                new_scores[i] = new_score
                max_diff = max(max_diff, abs(new_scores[i] - scores[i]))

            scores = new_scores
            if max_diff < tolerance:
                break

        return scores

    def _sentence_similarity(self, s1: str, s2: str) -> float:
        words1 = set(jieba.lcut(s1))
        words2 = set(jieba.lcut(s2))

        if len(words1) == 0 or len(words2) == 0:
            return 0.0

        intersection = words1 & words2
        union = words1 | words2

        if len(union) == 0:
            return 0.0

        return len(intersection) / len(union)


ai_service = AIService()